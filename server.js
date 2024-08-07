const express = require('express');
require('./config/dotenv'); // Load environment variables

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const routes = require('./routes');
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});