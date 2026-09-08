/**
 * ============================================================================
 * POWERSTOCK - SISTEMA DE CONTROL Y GESTIÓN DE SERVICIOS Y BATERÍAS
 * Lógica pura en JavaScript (ES6+), almacenamiento en localStorage,
 * diseño responsivo, paleta blanco y azul, tarjetas comprimidas y modal enfocado.
 * ============================================================================
 */

// Claves de almacenamiento local
const STORAGE_KEYS = {
  AUTH: 'powerstock_auth_session',
  SERVICES: 'powerstock_services_data',
  BATTERIES: 'powerstock_batteries_data',
  EMPLOYEES: 'powerstock_employees_data'
};

// Credenciales fijas de acceso (restringido a personal autorizado)
const AUTH_CREDENTIALS = {
  user: 'admin',
  pass: 'powerstock2024'
};

// ============================================================================
// DATOS INICIALES POR DEFECTO
// ============================================================================
const DEFAULT_EMPLOYEES = [
  { id: 'emp-1', nombre: 'YUL', cargo: 'Técnico de Instalaciones', telefono: '310 456 7890', estado: 'Activo' },
  { id: 'emp-2', nombre: 'ANDRES', cargo: 'Técnico Domiciliario', telefono: '311 987 6543', estado: 'Activo' },
  { id: 'emp-3', nombre: 'ENCISO', cargo: 'Encargado de Recargas', telefono: '315 222 3344', estado: 'Activo' },
  { id: 'emp-4', nombre: 'YESID', cargo: 'Técnico Integral', telefono: '320 888 9900', estado: 'Activo' }
];

const DEFAULT_BATTERIES = [
  {
    id: 'bat-1',
    nombre: 'Mac 650 izquierda',
    amperios: '65 Ah / 650 CCA',
    caja: '42',
    polaridad: 'Izquierda',
    imagen: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'bat-2',
    nombre: 'Faico 30H derecha',
    amperios: '75 Ah / 750 CCA',
    caja: '34',
    polaridad: 'Derecha',
    imagen: 'https://images.unsplash.com/photo-1597762470488-3877b1f538c6?auto=format&fit=crop&w=600&q=80'
  }
];

const DEFAULT_SERVICES = [
  {
    id: 'srv-101',
    tipo: 'venta',
    tipoLabel: 'Venta de Batería',
    fecha: '2026-09-08 10:15',
    cliente: 'Juan Carlos Restrepo',
    cedula: '1017234567',
    tipoPago: 'Bancolombia',
    mesesFiada: null,
    bateria: 'Mac 650 izquierda',
    serial: 'MC-8924-COL',
    valor: 380000,
    dejaBateriaUsada: 'Sí',
    tecnico: 'YUL',
    domicilio: 15000,
    direccion: 'Calle 10 # 43E-20, El Poblado',
    contacto: '3104561234',
    comentarios: 'Cliente habitual. Instalación rápida en Renault Duster.'
  },
  {
    id: 'srv-102',
    tipo: 'iniciada',
    tipoLabel: 'Iniciada de Batería',
    fecha: '2026-09-08 11:30',
    cliente: 'Mariana Duque',
    cedula: '',
    tipoPago: 'Nequi',
    mesesFiada: null,
    bateria: 'Iniciada de Batería (Arranque)',
    serial: '',
    valor: 45000,
    dejaBateriaUsada: 'No',
    tecnico: 'ANDRES',
    domicilio: 10000,
    direccion: 'Carrera 70 # 32-15',
    contacto: '3157894512',
    comentarios: 'Se verificó alternador y carga a 14.1V, todo en orden.'
  },
  {
    id: 'srv-103',
    tipo: 'recarga',
    tipoLabel: 'Recarga de Batería',
    fecha: '2026-09-08 13:45',
    cliente: 'Transportes Del Valle SAS',
    cedula: '',
    tipoPago: 'Fiada',
    mesesFiada: 2,
    bateria: 'Recarga Lenta de Batería',
    serial: '',
    valor: 30000,
    dejaBateriaUsada: 'No',
    tecnico: 'ENCISO',
    domicilio: 0,
    direccion: 'Taller Central',
    contacto: '3201122334',
    comentarios: 'Se deja durante 24 horas en banco de carga #2.'
  }
];

// ============================================================================
// GESTOR DE ALMACENAMIENTO (STORE)
// ============================================================================
class Store {
  constructor() {
    this.initData();
  }

  initData() {
    if (!localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) {
      localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(DEFAULT_EMPLOYEES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BATTERIES)) {
      localStorage.setItem(STORAGE_KEYS.BATTERIES, JSON.stringify(DEFAULT_BATTERIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
    }
  }

  isLoggedIn() {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
  }

  setLoggedIn(status) {
    if (status) {
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    }
  }

  getEmployees() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.EMPLOYEES)) || [];
    } catch (e) {
      return [];
    }
  }

  saveEmployees(list) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(list));
  }

  addEmployee(emp) {
    const list = this.getEmployees();
    emp.id = 'emp-' + Date.now();
    list.unshift(emp);
    this.saveEmployees(list);
    return emp;
  }

  updateEmployee(id, updatedData) {
    const list = this.getEmployees().map(emp => emp.id === id ? { ...emp, ...updatedData } : emp);
    this.saveEmployees(list);
  }

  deleteEmployee(id) {
    const list = this.getEmployees().filter(emp => emp.id !== id);
    this.saveEmployees(list);
  }

  getBatteries() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BATTERIES)) || [];
    } catch (e) {
      return [];
    }
  }

  saveBatteries(list) {
    localStorage.setItem(STORAGE_KEYS.BATTERIES, JSON.stringify(list));
  }

  addBattery(bat) {
    const list = this.getBatteries();
    bat.id = 'bat-' + Date.now();
    list.unshift(bat);
    this.saveBatteries(list);
    return bat;
  }

  updateBattery(id, updatedData) {
    const list = this.getBatteries().map(bat => bat.id === id ? { ...bat, ...updatedData } : bat);
    this.saveBatteries(list);
  }

  deleteBattery(id) {
    const list = this.getBatteries().filter(bat => bat.id !== id);
    this.saveBatteries(list);
  }

  getServices() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES)) || [];
    } catch (e) {
      return [];
    }
  }

  saveServices(list) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(list));
  }

  addService(service) {
    const list = this.getServices();
    service.id = 'srv-' + Date.now();
    service.fecha = formatCurrentDateTime();
    list.unshift(service);
    this.saveServices(list);
    return service;
  }

  // NOTA: Los registros de servicios NO se pueden editar (requisito explícito del usuario)
  deleteService(id) {
    const list = this.getServices().filter(s => s.id !== id);
    this.saveServices(list);
  }
}

const store = new Store();

// ============================================================================
// UTILIDADES Y FORMATEADORES
// ============================================================================
function formatCurrency(amount) {
  const num = Number(amount) || 0;
  return '$ ' + num.toLocaleString('es-CO');
}

function formatCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Alertas Toast Flotantes
 */
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: 'fa-solid fa-circle-check',
    info: 'fa-solid fa-circle-info',
    error: 'fa-solid fa-triangle-exclamation'
  };

  toast.innerHTML = `
    <div class="toast-icon"><i class="${iconMap[type] || iconMap.success}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" title="Cerrar"><i class="fa-solid fa-xmark"></i></button>
  `;

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      setTimeout(() => toast.remove(), 260);
    }
  }, 4200);
}

/**
 * Copiar texto estructurado al portapapeles
 */
function copyToClipboard(text, successMsg = '¡Copiado con éxito!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('¡Reporte Copiado!', successMsg, 'success');
    }).catch(() => {
      fallbackCopyText(text, successMsg);
    });
  } else {
    fallbackCopyText(text, successMsg);
  }
}

function fallbackCopyText(text, successMsg) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('¡Reporte Copiado!', successMsg, 'success');
  } catch (err) {
    showToast('Error al copiar', 'No se pudo copiar automáticamente al portapapeles.', 'error');
  }
  document.body.removeChild(textArea);
}

// ============================================================================
// CONTROLADOR DE VISTAS Y NAVEGACIÓN
// ============================================================================
const views = {
  login: document.getElementById('login-view'),
  app: document.getElementById('app-view')
};

function checkAuthentication() {
  if (store.isLoggedIn()) {
    views.login.classList.add('hidden');
    views.app.classList.remove('hidden');
    renderAll();
  } else {
    views.login.classList.remove('hidden');
    views.app.classList.add('hidden');
  }
}

// Tabs
const navTabBtns = document.querySelectorAll('.nav-tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

navTabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetTab = btn.getAttribute('data-tab');
    navTabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.remove('active'));

    btn.classList.add('active');
    const activeContent = document.getElementById(`tab-${targetTab}`);
    if (activeContent) activeContent.classList.add('active');
  });
});

// ============================================================================
// LOGIN Y LOGOUT
// ============================================================================
const loginForm = document.getElementById('login-form');
const loginUserInput = document.getElementById('login-username');
const loginPassInput = document.getElementById('login-password');
const loginError = document.getElementById('login-error');
const btnQuickFill = document.getElementById('btn-quick-fill');
const togglePwdBtn = document.getElementById('toggle-pwd');
const btnLogout = document.getElementById('btn-logout');

btnQuickFill?.addEventListener('click', () => {
  loginUserInput.value = AUTH_CREDENTIALS.user;
  loginPassInput.value = AUTH_CREDENTIALS.pass;
  loginError.classList.add('hidden');
});

togglePwdBtn?.addEventListener('click', () => {
  const isPwd = loginPassInput.type === 'password';
  loginPassInput.type = isPwd ? 'text' : 'password';
  togglePwdBtn.innerHTML = isPwd ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
});

loginForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = loginUserInput.value.trim();
  const pass = loginPassInput.value.trim();

  if (user === AUTH_CREDENTIALS.user && pass === AUTH_CREDENTIALS.pass) {
    loginError.classList.add('hidden');
    store.setLoggedIn(true);
    showToast('¡Bienvenido a PowerStock!', 'Sesión iniciada correctamente.', 'success');
    checkAuthentication();
  } else {
    loginError.classList.remove('hidden');
  }
});

btnLogout?.addEventListener('click', () => {
  store.setLoggedIn(false);
  showToast('Sesión Finalizada', 'Has cerrado sesión exitosamente.', 'info');
  checkAuthentication();
});

// ============================================================================
// MÓDULO: MODAL CENTRADO Y ENFOCADO PARA REGISTRO DE SERVICIOS
// ============================================================================
let currentSelectedServiceType = null;

const modalServiceFlow = document.getElementById('modal-service-flow');
const serviceStepType = document.getElementById('service-step-type');
const serviceStepForm = document.getElementById('service-step-form');
const btnOpenNewService = document.getElementById('btn-open-new-service');
const btnEmptyCreateService = document.getElementById('btn-empty-create-service');
const btnCloseServiceModal = document.getElementById('btn-close-service-modal');
const btnCloseServiceForm = document.getElementById('btn-close-service-form');
const btnBackToTypes = document.getElementById('btn-back-to-types');
const btnCancelService = document.getElementById('btn-cancel-service');

const dynamicServiceForm = document.getElementById('dynamic-service-form');
const currentServiceBadge = document.getElementById('current-service-badge');
const selectTipoPago = document.getElementById('srv-tipo-pago');
const groupMesesFiada = document.getElementById('group-meses-fiada');
const inputMesesFiada = document.getElementById('srv-meses-fiada');
const selectTecnico = document.getElementById('srv-tecnico');
const labelTecnico = document.getElementById('label-srv-tecnico');
const inputBateriaSearch = document.getElementById('srv-bateria-search');
const suggestionsList = document.getElementById('bateria-suggestions');

function openNewServiceModal() {
  currentSelectedServiceType = null;
  dynamicServiceForm.reset();
  groupMesesFiada.classList.add('hidden');
  suggestionsList.classList.add('hidden');
  
  serviceStepType.classList.remove('hidden');
  serviceStepForm.classList.add('hidden');
  modalServiceFlow.classList.remove('hidden');
}

function closeNewServiceModal() {
  modalServiceFlow.classList.add('hidden');
  dynamicServiceForm.reset();
}

btnOpenNewService?.addEventListener('click', openNewServiceModal);
btnEmptyCreateService?.addEventListener('click', openNewServiceModal);

btnCloseServiceModal?.addEventListener('click', closeNewServiceModal);
btnCloseServiceForm?.addEventListener('click', closeNewServiceModal);
btnCancelService?.addEventListener('click', closeNewServiceModal);

btnBackToTypes?.addEventListener('click', () => {
  serviceStepType.classList.remove('hidden');
  serviceStepForm.classList.add('hidden');
});

const serviceTypeBoxes = document.querySelectorAll('.service-type-box');
serviceTypeBoxes.forEach(box => {
  box.addEventListener('click', () => {
    const type = box.getAttribute('data-service-type');
    selectServiceType(type);
  });
});

function selectServiceType(type) {
  currentSelectedServiceType = type;
  serviceStepType.classList.add('hidden');
  serviceStepForm.classList.remove('hidden');

  populateTechniciansDropdown();

  // Reset de campos condicionales
  groupMesesFiada.classList.add('hidden');
  inputMesesFiada.removeAttribute('required');

  const ventaFields = document.querySelectorAll('.field-venta');

  if (type === 'venta') {
    currentServiceBadge.className = 'badge badge-venta';
    currentServiceBadge.innerHTML = '<i class="fa-solid fa-cart-shopping"></i> Venta de Batería';
    labelTecnico.innerHTML = '<i class="fa-solid fa-user-gear"></i> Técnico a instalar batería <span class="req">*</span>';

    ventaFields.forEach(el => el.classList.remove('hidden'));
    document.getElementById('srv-cedula').setAttribute('required', 'required');
    inputBateriaSearch.setAttribute('required', 'required');
    document.getElementById('srv-serial').setAttribute('required', 'required');

  } else if (type === 'iniciada') {
    currentServiceBadge.className = 'badge badge-iniciada';
    currentServiceBadge.innerHTML = '<i class="fa-solid fa-car-side"></i> Iniciada de Batería';
    labelTecnico.innerHTML = '<i class="fa-solid fa-user-gear"></i> Técnico a CARGO de recarga <span class="req">*</span>';

    ventaFields.forEach(el => el.classList.add('hidden'));
    document.getElementById('srv-cedula').removeAttribute('required');
    inputBateriaSearch.removeAttribute('required');
    document.getElementById('srv-serial').removeAttribute('required');

  } else if (type === 'recarga') {
    currentServiceBadge.className = 'badge badge-recarga';
    currentServiceBadge.innerHTML = '<i class="fa-solid fa-battery-half"></i> Recarga de Batería';
    labelTecnico.innerHTML = '<i class="fa-solid fa-user-gear"></i> Técnico que recibe la batería <span class="req">*</span>';

    ventaFields.forEach(el => el.classList.add('hidden'));
    document.getElementById('srv-cedula').removeAttribute('required');
    inputBateriaSearch.removeAttribute('required');
    document.getElementById('srv-serial').removeAttribute('required');
  }

  // Scroll suave al inicio del formulario
  const scrollable = dynamicServiceForm.parentElement;
  if (scrollable) scrollable.scrollTop = 0;
}

selectTipoPago?.addEventListener('change', (e) => {
  if (e.target.value === 'Fiada') {
    groupMesesFiada.classList.remove('hidden');
    inputMesesFiada.setAttribute('required', 'required');
  } else {
    groupMesesFiada.classList.add('hidden');
    inputMesesFiada.removeAttribute('required');
    inputMesesFiada.value = '';
  }
});

function populateTechniciansDropdown() {
  const employees = store.getEmployees().filter(e => e.estado === 'Activo');
  selectTecnico.innerHTML = '<option value="" disabled selected>Selecciona el técnico...</option>';

  if (employees.length === 0) {
    selectTecnico.innerHTML += '<option value="" disabled>No hay técnicos activos registrados</option>';
    return;
  }

  employees.forEach(emp => {
    const opt = document.createElement('option');
    opt.value = emp.nombre;
    opt.textContent = `${emp.nombre} (${emp.cargo})`;
    selectTecnico.appendChild(opt);
  });
}

inputBateriaSearch?.addEventListener('input', () => {
  const query = inputBateriaSearch.value.trim().toLowerCase();
  if (!query) {
    suggestionsList.classList.add('hidden');
    return;
  }

  const batteries = store.getBatteries();
  const matches = batteries.filter(b => 
    b.nombre.toLowerCase().includes(query) ||
    b.caja.toLowerCase().includes(query) ||
    b.amperios.toLowerCase().includes(query)
  );

  suggestionsList.innerHTML = '';
  if (matches.length === 0) {
    const li = document.createElement('li');
    li.className = 'suggestion-item';
    li.style.cursor = 'default';
    li.innerHTML = `<span>"${inputBateriaSearch.value}" (Se guardará como valor personalizado)</span>`;
    suggestionsList.appendChild(li);
  } else {
    matches.forEach(bat => {
      const li = document.createElement('li');
      li.className = 'suggestion-item';
      li.innerHTML = `
        <div>
          <strong>${bat.nombre}</strong>
          <div class="item-meta">${bat.amperios} • Caja ${bat.caja} • ${bat.polaridad}</div>
        </div>
        <span class="badge ${bat.polaridad === 'Izquierda' ? 'badge-pol-izq' : 'badge-pol-der'}">${bat.polaridad}</span>
      `;
      li.addEventListener('click', () => {
        inputBateriaSearch.value = bat.nombre;
        suggestionsList.classList.add('hidden');
      });
      suggestionsList.appendChild(li);
    });
  }

  suggestionsList.classList.remove('hidden');
});

document.addEventListener('click', (e) => {
  if (!inputBateriaSearch?.contains(e.target) && !suggestionsList?.contains(e.target)) {
    suggestionsList?.classList.add('hidden');
  }
});

dynamicServiceForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!currentSelectedServiceType) {
    showToast('Error', 'Selecciona primero el tipo de servicio.', 'error');
    return;
  }

  const formData = new FormData(dynamicServiceForm);
  const cliente = formData.get('cliente')?.toString().trim();
  const tipoPago = formData.get('tipoPago')?.toString().trim();
  const valor = Number(formData.get('valor')) || 0;
  const tecnico = formData.get('tecnico')?.toString().trim();

  if (!cliente || !tipoPago || !tecnico) {
    showToast('Campos requeridos', 'Completa los campos obligatorios (*).', 'error');
    return;
  }

  let bateria = '';
  let serial = '';
  let cedula = '';
  let dejaBateriaUsada = 'No';

  if (currentSelectedServiceType === 'venta') {
    bateria = formData.get('bateria')?.toString().trim() || '';
    serial = formData.get('serial')?.toString().trim() || '';
    cedula = formData.get('cedula')?.toString().trim() || '';
    dejaBateriaUsada = formData.get('dejaBateriaUsada')?.toString().trim() || 'No';

    if (!bateria || !serial || !cedula) {
      showToast('Campos de venta', 'Ingresa la cédula, la batería y el serial.', 'error');
      return;
    }
  } else if (currentSelectedServiceType === 'iniciada') {
    bateria = 'Iniciada de Batería (Arranque)';
  } else if (currentSelectedServiceType === 'recarga') {
    bateria = 'Recarga Lenta de Batería';
  }

  const mesesFiada = (tipoPago === 'Fiada') ? (Number(formData.get('mesesFiada')) || 1) : null;
  const domicilio = Number(formData.get('domicilio')) || 0;
  const direccion = formData.get('direccion')?.toString().trim() || '';
  const contacto = formData.get('contacto')?.toString().trim() || '';
  const comentarios = formData.get('comentarios')?.toString().trim() || '';

  const typeLabels = {
    venta: 'Venta de Batería',
    iniciada: 'Iniciada de Batería',
    recarga: 'Recarga de Batería'
  };

  const newService = {
    tipo: currentSelectedServiceType,
    tipoLabel: typeLabels[currentSelectedServiceType],
    cliente,
    cedula,
    tipoPago,
    mesesFiada,
    bateria,
    serial,
    valor,
    dejaBateriaUsada,
    tecnico,
    domicilio,
    direccion,
    contacto,
    comentarios
  };

  store.addService(newService);

  showToast('¡Servicio Registrado!', `Se guardó exitosamente el servicio para ${cliente}.`, 'success');

  closeNewServiceModal();
  renderServices();
  updateCounters();
});

// ============================================================================
// FORMATO Y COPIA PARA WHATSAPP / MENSAJERÍA
// (SIN NUMERACIÓN: limpio, elegante y listo para enviar)
// ============================================================================
function buildFormattedMessage(srv) {
  const pagoTexto = (srv.tipoPago === 'Fiada' && srv.mesesFiada)
    ? `Fiada (${srv.mesesFiada} ${srv.mesesFiada === 1 ? 'mes' : 'meses'})`
    : srv.tipoPago;

  let valorTexto = formatCurrency(srv.valor);
  if (srv.domicilio > 0) {
    valorTexto += ` (+ Domicilio: ${formatCurrency(srv.domicilio)})`;
  }

  const direccionTexto = srv.direccion ? srv.direccion : 'No especificada';
  const contactoTexto = srv.contacto ? srv.contacto : 'No especificado';
  const comentariosTexto = srv.comentarios ? srv.comentarios : 'Ninguno';

  // Texto sin numeración (0., 1., 2., etc. removidos para WhatsApp limpio)
  let msg = `⚡ *POWERSTOCK - REPORTE DE SERVICIO* ⚡\n`;
  msg += `📌 *Tipo de servicio:* ${srv.tipoLabel}\n`;
  msg += `📅 *Fecha:* ${srv.fecha}\n\n`;
  msg += `👨‍🔧 *Responsable de instalación:* ${srv.tecnico}\n`;
  msg += `👤 *Cliente:* ${srv.cliente}\n`;
  if (srv.cedula) {
    msg += `🪪 *Cédula:* ${srv.cedula}\n`;
  }
  msg += `💳 *Tipo de pago:* ${pagoTexto}\n`;
  msg += `💰 *Valor a pagar:* ${valorTexto}\n`;
  msg += `🔋 *Batería:* ${srv.bateria}\n`;
  if (srv.serial) {
    msg += `🔢 *Serial:* ${srv.serial}\n`;
  }
  if (srv.tipo === 'venta') {
    msg += `🔄 *Deja batería usada:* ${srv.dejaBateriaUsada}\n`;
  }
  msg += `📍 *Dirección:* ${direccionTexto}\n`;
  msg += `📱 *Número de contacto:* ${contactoTexto}\n`;
  if (srv.comentarios && srv.comentarios !== 'Ninguno') {
    msg += `📝 *Comentarios adicionales:* ${comentariosTexto}\n`;
  }
  msg += `\n_Generado por PowerStock_ 🚀`;

  return msg;
}

// ============================================================================
// MODAL: VER DETALLE COMPLETO DEL SERVICIO
// ============================================================================
const modalServiceDetail = document.getElementById('modal-service-detail');
const detailBadgeType = document.getElementById('detail-badge-type');
const detailDate = document.getElementById('detail-date');
const detailContentBody = document.getElementById('detail-content-body');
const btnDetailCopy = document.getElementById('btn-detail-copy');
let activeDetailService = null;

function openServiceDetailModal(srv) {
  activeDetailService = srv;

  const badgeClass = srv.tipo === 'venta' ? 'badge-venta' : (srv.tipo === 'iniciada' ? 'badge-iniciada' : 'badge-recarga');
  const badgeIcon = srv.tipo === 'venta' ? 'fa-cart-shopping' : (srv.tipo === 'iniciada' ? 'fa-car-side' : 'fa-battery-half');

  detailBadgeType.className = `badge ${badgeClass}`;
  detailBadgeType.innerHTML = `<i class="fa-solid ${badgeIcon}"></i> ${srv.tipoLabel}`;
  detailDate.innerHTML = `<i class="fa-regular fa-clock"></i> ${srv.fecha}`;

  const pagoTexto = (srv.tipoPago === 'Fiada' && srv.mesesFiada)
    ? `Fiada a ${srv.mesesFiada} ${srv.mesesFiada === 1 ? 'mes' : 'meses'}`
    : srv.tipoPago;

  detailContentBody.innerHTML = `
    <div class="detail-grid">
      <div class="detail-hero-banner">
        <div>
          <div class="hero-client">${srv.cliente}</div>
          ${srv.cedula ? `<div class="hero-cedula">Cédula: ${srv.cedula}</div>` : ''}
        </div>
        <div class="hero-total">
          <div class="hero-total-label">Total a pagar</div>
          <div class="hero-total-amount">${formatCurrency(srv.valor)}</div>
        </div>
      </div>

      <div class="detail-section-title">Detalles de Operación</div>

      <div class="detail-item-row">
        <span class="detail-icon"><i class="fa-solid fa-car-battery"></i></span>
        <div class="detail-item-content">
          <strong>Batería / Concepto:</strong> ${srv.bateria}
          ${srv.serial ? `<br><small style="color:var(--primary); font-weight:700;"><i class="fa-solid fa-barcode"></i> Serial: ${srv.serial}</small>` : ''}
        </div>
      </div>

      <div class="detail-item-row">
        <span class="detail-icon"><i class="fa-solid fa-user-gear"></i></span>
        <div class="detail-item-content">
          <strong>Responsable / Técnico:</strong> ${srv.tecnico}
        </div>
      </div>

      <div class="detail-item-row">
        <span class="detail-icon"><i class="fa-solid fa-wallet"></i></span>
        <div class="detail-item-content">
          <strong>Forma de pago:</strong> ${pagoTexto}
        </div>
      </div>

      <div class="detail-item-row">
        <span class="detail-icon"><i class="fa-solid fa-motorcycle"></i></span>
        <div class="detail-item-content">
          <strong>Valor del Domicilio:</strong> ${srv.domicilio > 0 ? formatCurrency(srv.domicilio) : 'Sin costo adicional ($0)'}
        </div>
      </div>

      ${srv.tipo === 'venta' ? `
        <div class="detail-item-row">
          <span class="detail-icon"><i class="fa-solid fa-recycle"></i></span>
          <div class="detail-item-content">
            <strong>¿Deja batería usada?:</strong> ${srv.dejaBateriaUsada || 'No'}
          </div>
        </div>
      ` : ''}

      <div class="detail-section-title">Ubicación y Contacto</div>

      <div class="detail-item-row">
        <span class="detail-icon"><i class="fa-solid fa-location-dot"></i></span>
        <div class="detail-item-content">
          <strong>Dirección:</strong> ${srv.direccion ? srv.direccion : 'No especificada (Atendido en taller o domicilio acordado)'}
        </div>
      </div>

      <div class="detail-item-row">
        <span class="detail-icon"><i class="fa-brands fa-whatsapp"></i></span>
        <div class="detail-item-content">
          <strong>Contacto:</strong> ${srv.contacto ? `
            <a href="https://wa.me/57${srv.contacto.replace(/[^0-9]/g, '')}" target="_blank" style="color: #10B981; font-weight: 700;">
              ${srv.contacto} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.75rem;"></i>
            </a>
          ` : 'No especificado'}
        </div>
      </div>

      ${srv.comentarios ? `
        <div class="detail-section-title">Comentarios Adicionales</div>
        <div class="detail-item-row">
          <span class="detail-icon"><i class="fa-regular fa-comment-dots"></i></span>
          <div class="detail-item-content" style="font-style: italic;">
            "${srv.comentarios}"
          </div>
        </div>
      ` : ''}
    </div>
  `;

  modalServiceDetail.classList.remove('hidden');
}

btnDetailCopy?.addEventListener('click', () => {
  if (activeDetailService) {
    const text = buildFormattedMessage(activeDetailService);
    copyToClipboard(text, '¡Mensaje copiado para WhatsApp!');
  }
});

// ============================================================================
// RENDERIZADO DE SERVICIOS EN CUADRITOS COMPRIMIDOS
// ============================================================================
const servicesGrid = document.getElementById('services-grid');
const servicesEmptyState = document.getElementById('services-empty-state');
const searchServicesInput = document.getElementById('search-services-input');
const clearSearchServicesBtn = document.getElementById('clear-search-services');
const serviceFilterBtns = document.querySelectorAll('#services-type-filters .filter-btn');

let currentServiceFilter = 'all';

serviceFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    serviceFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentServiceFilter = btn.getAttribute('data-filter');
    renderServices();
  });
});

searchServicesInput?.addEventListener('input', () => {
  if (searchServicesInput.value.trim().length > 0) {
    clearSearchServicesBtn.classList.remove('hidden');
  } else {
    clearSearchServicesBtn.classList.add('hidden');
  }
  renderServices();
});

clearSearchServicesBtn?.addEventListener('click', () => {
  searchServicesInput.value = '';
  clearSearchServicesBtn.classList.add('hidden');
  renderServices();
});

function renderServices() {
  const allServices = store.getServices();
  const query = searchServicesInput?.value.trim().toLowerCase() || '';

  const filtered = allServices.filter(s => {
    if (currentServiceFilter !== 'all' && s.tipo !== currentServiceFilter) {
      return false;
    }
    if (query) {
      return (
        s.cliente?.toLowerCase().includes(query) ||
        s.tecnico?.toLowerCase().includes(query) ||
        s.bateria?.toLowerCase().includes(query) ||
        s.cedula?.toLowerCase().includes(query) ||
        s.serial?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  document.getElementById('filter-all-count').textContent = allServices.length;
  document.getElementById('filter-venta-count').textContent = allServices.filter(s => s.tipo === 'venta').length;
  document.getElementById('filter-iniciada-count').textContent = allServices.filter(s => s.tipo === 'iniciada').length;
  document.getElementById('filter-recarga-count').textContent = allServices.filter(s => s.tipo === 'recarga').length;

  servicesGrid.innerHTML = '';

  if (filtered.length === 0) {
    servicesEmptyState.classList.remove('hidden');
    return;
  }

  servicesEmptyState.classList.add('hidden');

  filtered.forEach(srv => {
    const card = document.createElement('div');
    card.className = 'service-card-compact';

    const badgeClass = srv.tipo === 'venta' ? 'badge-venta' : (srv.tipo === 'iniciada' ? 'badge-iniciada' : 'badge-recarga');
    const badgeIcon = srv.tipo === 'venta' ? 'fa-cart-shopping' : (srv.tipo === 'iniciada' ? 'fa-car-side' : 'fa-battery-half');

    card.innerHTML = `
      <div>
        <div class="compact-card-top">
          <span class="badge ${badgeClass}"><i class="fa-solid ${badgeIcon}"></i> ${srv.tipoLabel}</span>
          <span class="compact-amount">${formatCurrency(srv.valor)}</span>
        </div>

        <h4 class="compact-client" title="${srv.cliente}">
          <i class="fa-regular fa-user" style="color: var(--primary);"></i>
          ${srv.cliente}
        </h4>

        <div class="compact-info-row" title="${srv.bateria}">
          <i class="fa-solid fa-car-battery"></i>
          <span>${srv.bateria}</span>
        </div>

        <div class="compact-info-row">
          <i class="fa-solid fa-user-gear"></i>
          <span>Técnico: <strong>${srv.tecnico}</strong></span>
        </div>
      </div>

      <div class="compact-card-footer">
        <button type="button" class="btn-view-detail" title="Ver información completa">
          <i class="fa-regular fa-eye"></i> Ver
        </button>
        <button type="button" class="btn-compact-copy" title="Copiar reporte para WhatsApp">
          <i class="fa-brands fa-whatsapp"></i> Copiar
        </button>
        <button type="button" class="btn-compact-del" title="Eliminar registro">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (!e.target.closest('.btn-compact-copy') && !e.target.closest('.btn-compact-del')) {
        openServiceDetailModal(srv);
      }
    });

    card.querySelector('.btn-view-detail').addEventListener('click', (e) => {
      e.stopPropagation();
      openServiceDetailModal(srv);
    });

    card.querySelector('.btn-compact-copy').addEventListener('click', (e) => {
      e.stopPropagation();
      const messageText = buildFormattedMessage(srv);
      copyToClipboard(messageText, '¡Reporte copiado sin numeración!');
    });

    card.querySelector('.btn-compact-del').addEventListener('click', (e) => {
      e.stopPropagation();
      openConfirmModal(
        '¿Eliminar servicio?',
        `¿Deseas eliminar el registro de "${srv.cliente}"? Esta acción no se puede deshacer.`,
        () => {
          store.deleteService(srv.id);
          showToast('Servicio Eliminado', 'El registro fue removido.', 'info');
          renderServices();
          updateCounters();
        }
      );
    });

    servicesGrid.appendChild(card);
  });
}

// ============================================================================
// MÓDULO: CATÁLOGO DE BATERÍAS (CRUD)
// ============================================================================
const batteriesGrid = document.getElementById('batteries-grid');
const batteriesEmptyState = document.getElementById('batteries-empty-state');
const btnOpenNewBattery = document.getElementById('btn-open-new-battery');
const searchBatteriesInput = document.getElementById('search-batteries-input');
const polarityFilterBtns = document.querySelectorAll('#polarity-filters .filter-btn');

const modalBattery = document.getElementById('modal-battery');
const formBattery = document.getElementById('form-battery');
const modalBatteryTitle = document.getElementById('modal-battery-title');
const batEditId = document.getElementById('bat-edit-id');
const batNombreInput = document.getElementById('bat-nombre');
const batAmperiosInput = document.getElementById('bat-amperios');
const batCajaInput = document.getElementById('bat-caja');
const batImageInput = document.getElementById('bat-image-url');
const batFileInput = document.getElementById('bat-file-input');
const btnTriggerFile = document.getElementById('btn-trigger-file');
const batImagePreview = document.getElementById('bat-image-preview');
const batPreviewPlaceholder = document.getElementById('bat-preview-placeholder');

let currentPolarityFilter = 'all';
let currentBatteryUploadedBase64 = '';

polarityFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    polarityFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentPolarityFilter = btn.getAttribute('data-polarity');
    renderBatteries();
  });
});

searchBatteriesInput?.addEventListener('input', () => {
  renderBatteries();
});

btnOpenNewBattery?.addEventListener('click', () => {
  openBatteryModal();
});

document.getElementById('btn-empty-create-battery')?.addEventListener('click', () => {
  openBatteryModal();
});

btnTriggerFile?.addEventListener('click', () => {
  batFileInput.click();
});

batFileInput?.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      currentBatteryUploadedBase64 = evt.target.result;
      updateBatteryImagePreview(currentBatteryUploadedBase64);
      batImageInput.value = '';
    };
    reader.readAsDataURL(file);
  }
});

batImageInput?.addEventListener('input', () => {
  const url = batImageInput.value.trim();
  if (url) {
    currentBatteryUploadedBase64 = '';
    updateBatteryImagePreview(url);
  } else {
    updateBatteryImagePreview('');
  }
});

function updateBatteryImagePreview(src) {
  if (src) {
    batImagePreview.src = src;
    batImagePreview.classList.remove('hidden');
    batPreviewPlaceholder.classList.add('hidden');
  } else {
    batImagePreview.src = '';
    batImagePreview.classList.add('hidden');
    batPreviewPlaceholder.classList.remove('hidden');
  }
}

function openBatteryModal(battery = null) {
  formBattery.reset();
  currentBatteryUploadedBase64 = '';

  if (battery) {
    modalBatteryTitle.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Modificar Batería';
    batEditId.value = battery.id;
    batNombreInput.value = battery.nombre;
    batAmperiosInput.value = battery.amperios;
    batCajaInput.value = battery.caja;

    if (battery.polaridad === 'Derecha') {
      document.getElementById('pol-der').checked = true;
    } else {
      document.getElementById('pol-izq').checked = true;
    }

    if (battery.imagen && battery.imagen.startsWith('data:')) {
      currentBatteryUploadedBase64 = battery.imagen;
      updateBatteryImagePreview(battery.imagen);
    } else if (battery.imagen) {
      batImageInput.value = battery.imagen;
      updateBatteryImagePreview(battery.imagen);
    } else {
      updateBatteryImagePreview('');
    }
  } else {
    modalBatteryTitle.innerHTML = '<i class="fa-solid fa-car-battery"></i> Nueva Batería';
    batEditId.value = '';
    document.getElementById('pol-izq').checked = true;
    updateBatteryImagePreview('');
  }

  modalBattery.classList.remove('hidden');
}

formBattery?.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = batEditId.value;
  const nombre = batNombreInput.value.trim();
  const amperios = batAmperiosInput.value.trim();
  const caja = batCajaInput.value.trim();
  const polaridad = document.querySelector('input[name="batPolaridad"]:checked')?.value || 'Izquierda';
  const imagen = currentBatteryUploadedBase64 || batImageInput.value.trim();

  if (!nombre || !amperios || !caja) {
    showToast('Campos requeridos', 'Ingresa nombre, amperios y caja.', 'error');
    return;
  }

  if (id) {
    store.updateBattery(id, { nombre, amperios, caja, polaridad, imagen });
    showToast('Batería Actualizada', `Se modificó "${nombre}" correctamente.`, 'success');
  } else {
    store.addBattery({ nombre, amperios, caja, polaridad, imagen });
    showToast('Batería Registrada', `Se agregó "${nombre}" al catálogo.`, 'success');
  }

  modalBattery.classList.add('hidden');
  renderBatteries();
  updateCounters();
});

function renderBatteries() {
  const allBatteries = store.getBatteries();
  const query = searchBatteriesInput?.value.trim().toLowerCase() || '';

  const filtered = allBatteries.filter(b => {
    if (currentPolarityFilter !== 'all' && b.polaridad !== currentPolarityFilter) {
      return false;
    }
    if (query) {
      return (
        b.nombre.toLowerCase().includes(query) ||
        b.amperios.toLowerCase().includes(query) ||
        b.caja.toLowerCase().includes(query)
      );
    }
    return true;
  });

  batteriesGrid.innerHTML = '';

  if (filtered.length === 0) {
    batteriesEmptyState.classList.remove('hidden');
    return;
  }

  batteriesEmptyState.classList.add('hidden');

  filtered.forEach(bat => {
    const card = document.createElement('div');
    card.className = 'battery-card';

    const hasImage = bat.imagen && bat.imagen.trim().length > 0;
    const polarityBadgeClass = bat.polaridad === 'Izquierda' ? 'badge-pol-izq' : 'badge-pol-der';

    card.innerHTML = `
      <div class="battery-image-wrap">
        ${hasImage ? `
          <img src="${bat.imagen}" alt="${bat.nombre}" class="battery-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="battery-img-fallback" style="display:none;">
            <i class="fa-solid fa-car-battery"></i>
            <span>PowerStock Battery</span>
          </div>
        ` : `
          <div class="battery-img-fallback">
            <i class="fa-solid fa-car-battery"></i>
            <span>Sin imagen</span>
          </div>
        `}
        <div class="battery-polarity-float">
          <span class="badge ${polarityBadgeClass}">
            <i class="fa-solid ${bat.polaridad === 'Izquierda' ? 'fa-arrow-left' : 'fa-arrow-right'}"></i>
            ${bat.polaridad}
          </span>
        </div>
      </div>

      <div class="battery-details">
        <h3 class="battery-title">${bat.nombre}</h3>

        <div class="battery-specs-grid">
          <div class="spec-item">
            <span class="spec-label">Amperaje</span>
            <span class="spec-val">${bat.amperios}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Caja BCI</span>
            <span class="spec-val">${bat.caja}</span>
          </div>
        </div>

        <div class="card-action-buttons" style="margin-top: auto;">
          <button type="button" class="btn-card-action btn-edit-bat" data-id="${bat.id}">
            <i class="fa-solid fa-pen-to-square"></i> Modificar
          </button>
          <button type="button" class="btn-card-action btn-del btn-del-bat" data-id="${bat.id}">
            <i class="fa-solid fa-trash-can"></i> Eliminar
          </button>
        </div>
      </div>
    `;

    card.querySelector('.btn-edit-bat').addEventListener('click', () => {
      openBatteryModal(bat);
    });

    card.querySelector('.btn-del-bat').addEventListener('click', () => {
      openConfirmModal(
        '¿Eliminar batería?',
        `¿Deseas eliminar "${bat.nombre}" del catálogo?`,
        () => {
          store.deleteBattery(bat.id);
          showToast('Batería Eliminada', 'La batería fue retirada del inventario.', 'info');
          renderBatteries();
          updateCounters();
        }
      );
    });

    batteriesGrid.appendChild(card);
  });
}

// ============================================================================
// MÓDULO: EMPLEADOS Y TÉCNICOS (CRUD)
// ============================================================================
const employeesGrid = document.getElementById('employees-grid');
const employeesEmptyState = document.getElementById('employees-empty-state');
const btnOpenNewEmployee = document.getElementById('btn-open-new-employee');

const modalEmployee = document.getElementById('modal-employee');
const formEmployee = document.getElementById('form-employee');
const modalEmployeeTitle = document.getElementById('modal-employee-title');
const empEditId = document.getElementById('emp-edit-id');
const empNombreInput = document.getElementById('emp-nombre');
const empCargoSelect = document.getElementById('emp-cargo');
const empTelefonoInput = document.getElementById('emp-telefono');

btnOpenNewEmployee?.addEventListener('click', () => {
  openEmployeeModal();
});

document.getElementById('btn-empty-create-employee')?.addEventListener('click', () => {
  openEmployeeModal();
});

function openEmployeeModal(emp = null) {
  formEmployee.reset();

  if (emp) {
    modalEmployeeTitle.innerHTML = '<i class="fa-solid fa-user-pen"></i> Modificar Empleado';
    empEditId.value = emp.id;
    empNombreInput.value = emp.nombre;
    empCargoSelect.value = emp.cargo;
    empTelefonoInput.value = emp.telefono || '';

    if (emp.estado === 'Inactivo') {
      document.getElementById('emp-inactivo').checked = true;
    } else {
      document.getElementById('emp-activo').checked = true;
    }
  } else {
    modalEmployeeTitle.innerHTML = '<i class="fa-solid fa-user-plus"></i> Nuevo Empleado';
    empEditId.value = '';
    document.getElementById('emp-activo').checked = true;
  }

  modalEmployee.classList.remove('hidden');
}

formEmployee?.addEventListener('submit', (e) => {
  e.preventDefault();

  const id = empEditId.value;
  const nombre = empNombreInput.value.trim();
  const cargo = empCargoSelect.value;
  const telefono = empTelefonoInput.value.trim();
  const estado = document.querySelector('input[name="empEstado"]:checked')?.value || 'Activo';

  if (!nombre) {
    showToast('Nombre requerido', 'Ingresa el nombre del técnico o empleado.', 'error');
    return;
  }

  if (id) {
    store.updateEmployee(id, { nombre, cargo, telefono, estado });
    showToast('Empleado Actualizado', `Se guardaron los cambios para ${nombre}.`, 'success');
  } else {
    store.addEmployee({ nombre, cargo, telefono, estado });
    showToast('Empleado Agregado', `Se agregó al técnico ${nombre} con éxito.`, 'success');
  }

  modalEmployee.classList.add('hidden');
  renderEmployees();
  updateCounters();
});

function renderEmployees() {
  const employees = store.getEmployees();
  const services = store.getServices();

  employeesGrid.innerHTML = '';

  if (employees.length === 0) {
    employeesEmptyState.classList.remove('hidden');
    return;
  }

  employeesEmptyState.classList.add('hidden');

  employees.forEach(emp => {
    const card = document.createElement('div');
    card.className = 'employee-card';

    const totalServices = services.filter(s => s.tecnico && s.tecnico.toUpperCase() === emp.nombre.toUpperCase()).length;
    const initial = emp.nombre.charAt(0).toUpperCase();
    const badgeState = emp.estado === 'Activo' ? 'badge-activo' : 'badge-inactivo';

    card.innerHTML = `
      <div class="emp-header">
        <div class="emp-avatar-large">${initial}</div>
        <div>
          <h3 class="emp-name">${emp.nombre}</h3>
          <span class="emp-cargo">${emp.cargo}</span>
        </div>
      </div>

      <div class="emp-stats">
        <div>
          <div class="stat-number">${totalServices}</div>
          <div class="stat-label">Servicios realizados</div>
        </div>
        <div>
          <span class="badge ${badgeState}" style="margin-top: 6px;">
            <i class="fa-solid ${emp.estado === 'Activo' ? 'fa-check' : 'fa-xmark'}"></i> ${emp.estado}
          </span>
          <div class="stat-label" style="margin-top: 4px;">Estado</div>
        </div>
      </div>

      <div class="card-info-list" style="margin-bottom: 16px;">
        <div class="info-item" style="font-size:0.86rem; color:var(--text-secondary); display:flex; align-items:center; gap:8px;">
          <i class="fa-solid fa-phone" style="color:var(--primary);"></i>
          <span>${emp.telefono || 'Sin teléfono registrado'}</span>
        </div>
      </div>

      <div class="card-action-buttons" style="margin-top: auto;">
        <button type="button" class="btn-card-action btn-edit-emp" data-id="${emp.id}">
          <i class="fa-solid fa-pen-to-square"></i> Modificar
        </button>
        <button type="button" class="btn-card-action btn-del btn-del-emp" data-id="${emp.id}">
          <i class="fa-solid fa-trash-can"></i> Eliminar
        </button>
      </div>
    `;

    card.querySelector('.btn-edit-emp').addEventListener('click', () => {
      openEmployeeModal(emp);
    });

    card.querySelector('.btn-del-emp').addEventListener('click', () => {
      openConfirmModal(
        '¿Eliminar empleado?',
        `¿Deseas eliminar a "${emp.nombre}" del equipo de técnicos?`,
        () => {
          store.deleteEmployee(emp.id);
          showToast('Empleado Removido', `Se eliminó a ${emp.nombre}.`, 'info');
          renderEmployees();
          updateCounters();
        }
      );
    });

    employeesGrid.appendChild(card);
  });
}

// ============================================================================
// MODAL GENÉRICO DE CONFIRMACIÓN
// ============================================================================
const modalConfirm = document.getElementById('modal-confirm');
const confirmTitle = document.getElementById('confirm-title');
const confirmMessage = document.getElementById('confirm-message');
const btnConfirmAccept = document.getElementById('btn-confirm-accept');
const btnConfirmCancel = document.getElementById('btn-confirm-cancel');

let pendingConfirmAction = null;

function openConfirmModal(title, message, onAccept) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  pendingConfirmAction = onAccept;
  modalConfirm.classList.remove('hidden');
}

btnConfirmAccept?.addEventListener('click', () => {
  if (typeof pendingConfirmAction === 'function') {
    pendingConfirmAction();
  }
  modalConfirm.classList.add('hidden');
  pendingConfirmAction = null;
});

btnConfirmCancel?.addEventListener('click', () => {
  modalConfirm.classList.add('hidden');
  pendingConfirmAction = null;
});

document.querySelectorAll('.modal-close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-modal');
    if (modalId) {
      document.getElementById(modalId)?.classList.add('hidden');
    }
  });
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.add('hidden');
    }
  });
});

// ============================================================================
// ACTUALIZACIÓN DE CONTADORES GLOBALES
// ============================================================================
function updateCounters() {
  const srvCount = store.getServices().length;
  const batCount = store.getBatteries().length;
  const empCount = store.getEmployees().length;

  const elSrv = document.getElementById('count-servicios');
  const elBat = document.getElementById('count-baterias');
  const elEmp = document.getElementById('count-empleados');

  if (elSrv) elSrv.textContent = srvCount;
  if (elBat) elBat.textContent = batCount;
  if (elEmp) elEmp.textContent = empCount;
}

// ============================================================================
// RENDERIZADO GLOBAL
// ============================================================================
function renderAll() {
  renderServices();
  renderBatteries();
  renderEmployees();
  updateCounters();
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
});
