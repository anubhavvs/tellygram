const storageToken = 'tellygramUserKey'

const saveUser = (user) => {
    localStorage.setItem(storageToken, JSON.stringify(user));
}

const loadUser = () => JSON.parse(localStorage.getItem(storageToken));

const removeUser = () => {
    localStorage.removeItem(storageToken);
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    saveUser,
    loadUser,
    removeUser
}