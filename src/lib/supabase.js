// ==========================================
// ACC - ADAPTADOR DE CLIENTE SUPABASE A MYSQL (FETCH API)
// ==========================================

const API_URL = import.meta.env.VITE_API_URL || '/api';

class QueryBuilder {
  constructor(table) {
    this.table = table;
    this.params = {};
    this.method = 'GET';
    this.body = null;
    this.isSingle = false;
    this.isCount = false;
    this.id = null;
  }

  select(fields = '*', options = {}) {
    this.method = 'GET';
    if (options.count === 'exact' && options.head === true) {
      this.isCount = true;
    }
    return this;
  }

  insert(data) {
    this.method = 'POST';
    // En React se suele pasar un array de un elemento: insert([formData])
    this.body = Array.isArray(data) ? data[0] : data;
    return this;
  }

  update(data) {
    this.method = 'PUT';
    this.body = data;
    return this;
  }

  delete() {
    this.method = 'DELETE';
    return this;
  }

  eq(field, value) {
    if (field === 'id') {
      this.id = value;
    } else {
      this.params[field] = value;
    }
    return this;
  }

  order(field, options = {}) {
    this.params.order_by = field;
    this.params.order = options.ascending ? 'asc' : 'desc';
    return this;
  }

  limit(val) {
    this.params.limit = val;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  // Intercepta la resolución del objeto cuando es awaited
  async then(resolve, reject) {
    try {
      const res = await this.execute();
      resolve(res);
    } catch (err) {
      if (reject) reject(err);
    }
  }

  async execute() {
    let endpoint = '';
    
    // Mapeo de tablas de Supabase a archivos PHP de la API
    if (this.table === 'trabajos') endpoint = 'trabajos.php';
    else if (this.table === 'promociones') endpoint = 'promociones.php';
    else if (this.table === 'mensajes_contacto') endpoint = 'mensajes.php';
    else if (this.table === 'categorias') endpoint = 'categorias.php';
    else if (this.table === 'trabajo_imagenes') endpoint = 'trabajo_imagenes.php';

    let url = `${API_URL}/${endpoint}`;
    const queryParts = [];

    if (this.id) {
      queryParts.push(`id=${this.id}`);
    }
    if (this.params.trabajo_id) {
      queryParts.push(`trabajo_id=${this.params.trabajo_id}`);
    }
    if (this.params.activa !== undefined) {
      queryParts.push(`activa=${this.params.activa ? 1 : 0}`);
    }
    if (this.params.limit) {
      queryParts.push(`limit=${this.params.limit}`);
    }
    if (this.params.order_by) {
      queryParts.push(`order=${this.params.order_by}`);
    }

    if (queryParts.length > 0) {
      url += `?${queryParts.join('&')}`;
    }

    // Caso especial de conteo para el Dashboard
    if (this.isCount && this.table) {
      try {
        const dashRes = await fetch(`${API_URL}/dashboard.php`);
        const dashData = await dashRes.json();
        
        let countVal = 0;
        if (this.table === 'trabajos') countVal = dashData.trabajos;
        else if (this.table === 'promociones') countVal = dashData.promociones;
        else if (this.table === 'mensajes_contacto' && this.params.leido === false) countVal = dashData.noLeidos;
        else if (this.table === 'mensajes_contacto') countVal = dashData.mensajes;

        return { count: countVal, data: null, error: null };
      } catch (err) {
        return { count: 0, data: null, error: { message: err.message } };
      }
    }

    const headers = { 'Content-Type': 'application/json' };
    
    // Obtener sesión guardada de localStorage si existe
    const sessionStr = localStorage.getItem('acc_session');
    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session && session.user) {
          headers['X-User-Email'] = session.user.email;
        }
      } catch (e) {
        // Ignorar errores al parsear sesión
      }
    }

    const requestOptions = {
      method: this.method,
      headers
    };

    if (this.body) {
      requestOptions.body = JSON.stringify(this.body);
    }

    try {
      const fetchRes = await fetch(url, requestOptions);
      
      if (!fetchRes.ok) {
        const errData = await fetchRes.json().catch(() => ({}));
        return { data: null, error: { message: errData.error || 'Error en la petición al servidor' } };
      }

      const data = await fetchRes.json();
      
      if (data && data.success) {
        return { data: data, error: null };
      }

      return { data: this.isSingle && Array.isArray(data) ? data[0] : data, error: null };
    } catch (err) {
      return { data: null, error: { message: "Error de red: " + err.message } };
    }
  }
}

let authListeners = [];

const triggerAuthChange = (event, session) => {
  authListeners.forEach(cb => {
    try {
      cb(event, session);
    } catch (e) {
      console.error("Error in auth listener:", e);
    }
  });
};

export const supabase = {
  from: (table) => new QueryBuilder(table),
  auth: {
    signInWithPassword: async ({ email, password }) => {
      try {
        const res = await fetch(`${API_URL}/auth.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          return { data: null, error: { message: errData.error || 'Credenciales incorrectas' } };
        }

        const data = await res.json();
        // Guardar sesión de forma local
        localStorage.setItem('acc_session', JSON.stringify(data.session));
        triggerAuthChange('SIGNED_IN', data.session);
        return { data: data, error: null };
      } catch (err) {
        return { data: null, error: { message: err.message } };
      }
    },

    signOut: async () => {
      localStorage.removeItem('acc_session');
      triggerAuthChange('SIGNED_OUT', null);
      return { error: null };
    },

    getSession: async () => {
      const session = localStorage.getItem('acc_session');
      return { data: { session: session ? JSON.parse(session) : null } };
    },

    onAuthStateChange: (callback) => {
      const session = localStorage.getItem('acc_session');
      callback('SIGNED_IN', session ? JSON.parse(session) : null);
      authListeners.push(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => {
              authListeners = authListeners.filter(cb => cb !== callback);
            }
          }
        }
      };
    }
  }
};
