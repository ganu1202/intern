class ExpressError extends Error {
    constructor(status, message) {
        super(message); // Pass the message to the parent class
        this.status = status;
    }
}

module.exports = ExpressError; // Ensure you export the class


