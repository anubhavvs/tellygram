const registerValidator = (username, password) => {
    const errors = {};
    // validates username length
    if (username.trim() === '' || username.length > 20 || username.length < 3) {
      errors.username = 'Username must be in range of 3-20 characters length.';
    }
    // validates password with regex
    if (!/^[a-zA-Z0-9-_]*$/.test(username)) {
      errors.username = 'Username must have alphanumeric characters only.';
    }
    //validates password length
    if (!password || password.length < 6) {
      errors.password = 'Password must be atleast 6 characters long.';
    }
    return {
      errors,
      valid: Object.keys(errors).length < 1,
    };
};

module.exports = registerValidator;