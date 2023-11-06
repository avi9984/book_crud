const validEmail = (Email) => {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(Email)) {
        return true;
    } else {
        return false;
    }
};

const validPwd = (Password) => {
    if (
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(
            Password
        )
    ) {
        return true;
    } else {
        return false;
    }
};

module.exports = { validEmail, validPwd }