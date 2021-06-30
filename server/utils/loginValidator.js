const loginValidator = (username, password) => {
    const errors = {};
    // validates username legth
    if(username.trim() === '') {
        errors.username = 'Username cannot be empty.';
    }
    // validates password length
    if(!password) {
        errors.password = 'Password cannot be empty.';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1,
    };
}

module.exports = loginValidator;