import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost/server/api/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. Projeye özel API çağrılarını fonksiyon olarak tanımla.
// Bu, "type" parametresini ve diğer detayları gizler.

/**
 * Kullanıcı giriş işlemi için API çağrısı yapar.
 * @param {object} credentials - { username, password }
 * @returns {Promise<object>}
 */
export const loginUser = (credentials) => {
    return apiClient.post('index.php', {
        ...credentials,
        type: 'login'
    });
};

/**
 * Kullanıcı çıkış işlemi için API çağrısı yapar.
 * @returns {Promise<object>}
 */
export const logoutUser = () => {
    return apiClient.post('index.php', {
        type: 'logout'
    });
};

/**
 * Kullanıcı oturum kontrolü işlemi için API çağrısı yapar.
 * @returns {Promise<object>}
 */
export const controlUser = () => {
    return apiClient.post('index.php', {
        type: 'checkSession'
    });
};

/**
 * QR Kodu okutulan aracı getirir.
 * @returns {Promise<object>}
 */
export const getVehicleAPI = (credentials) => {
    return apiClient.post('index.php', {
        ...credentials,
        type: 'getVechile'
    });
};

/**
 * QR Kodu okutulan aracı getirir.
 * @returns {Promise<object>}
 */
export const startTripAPI = (credentials) => {
    return apiClient.post('index.php', {
        ...credentials,
        type: 'startTrip'
    });
};

/**
 * QR Kodu okutulan aracı getirir.
 * @returns {Promise<object>}
 */
export const fetchActiveTripAPI = (credentials) => {
    return apiClient.post('index.php', {
        ...credentials,
        type: 'activeTrip'
    });
};

/**
 * QR Kodu okutulan aracı getirir.
 * @returns {Promise<object>}
 */
export const completeTripAPI = (credentials) => {
    return apiClient.post('index.php', {
        ...credentials,
        type: 'completeTrip'
    });
};

/**
 * Araç listesini getiren API çağrısı yapar.
 * @returns {Promise<object>}
 */
export const fetchVehicles = () => {
    return apiClient.post('index.php', {
        type: 'aracListele'
    });
};

/**
 * Yeni bir araç ekler.
 * @param {object} vehicleData - Eklenecek aracın bilgileri
 * @returns {Promise<object>}
 */
export const addVehicle = (vehicleData) => {
    return apiClient.post('index.php', {
        ...vehicleData,
        type: 'aracEkle'
    });
};

// ... diğer tüm API çağrıların için buraya fonksiyonlar ekleyebilirsin ...
// ornek: kazaBildir, aracSil vs.

// İstersen doğrudan apiClient'i de export edebilirsin ama fonksiyonlar daha temiz.
export default apiClient;