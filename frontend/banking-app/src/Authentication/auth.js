
export const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const getUserEmail = () => {
    return localStorage.getItem('email');
};

export const getUserRoles = () => {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
};

export const isAdmin = () => {
    const roles = getUserRoles();
    return roles.includes('ROLE_ADMIN');
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
    window.location.href = '/login';
};


export const getAuthHeaders = () => {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};
