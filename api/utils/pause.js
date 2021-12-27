module.exports = function pause(time) {
    return new Promise(resolve => setTimeout(() => {
        resolve();
    }, time || 300));
}