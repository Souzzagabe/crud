const fs = require('fs')
const DB_FILE_PATH = "./core/db"


console.log("[CRUD]");

function create(content) {

    fs.writeFileSync(DB_FILE_PATH, content)
    return content;
}

// SIMULATION

create("Hoje eu preciso gravar aulas!")