const db = require("../util/database");

module.exports = class Recipe {
  constructor(id, name, description, time, image){
    this.id = id;
    this.names = name;
    this.description = description;
    this.time =  time;
    this.image = image
  }

  save(){
    return db.execute("INSERT INTO recipes (names, description, time, image) VALUES (?, ?, ?, ?)",
    [this.names , this.description, this.time, this.image]
    );
  }

  static fetchAll(){
    return db.execute("SELECT * FROM recipes");

  }

  static findById(id){
    return db.execute("SELECT * FROM recipes WHERE recipes.id = ?", [id]);
  }

  static deleteById(id){
    return db.execute("DELETE FROM recipes WHERE id = ?" [id]);
  }

  update(id, names, description, time, image){
    return db.execute(`UPDATE recipes SET names =${names}, description = ${description}, time = ${time} image = ${image} WHERE id = ${id};`)

  }
}
