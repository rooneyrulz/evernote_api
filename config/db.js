const mongoose = require('mongoose');

module.exports = async(server) => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });
        if (conn.connection) {
            console.log(
                `mongo connection established on ${conn.connection.host} ${conn.connection.port}..`
                .inverse.cyan
            );
            server.listen(process.env.PORT || 5000, () =>
                console.log(
                    `Server running on ${process.env.NODE_ENV} port ${
            process.env.PORT || 5000
          }..`.yellow
                )
            );
        }
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};