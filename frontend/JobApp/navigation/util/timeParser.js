const getTime = () => {
    return new Date().getTime();
};

const getStringTime = (milliseconds) => {
    return new Date(milliseconds).toLocaleString();
};

export { getTime, getStringTime };
