const { render } = require("ejs");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const port = 3000;
const { loadContact, addContact, cekDuplikat, findContact, deleteContact, editContact } = require("./utils/contacts");
const {body, validationResult} = require("express-validator");
const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "myProject";

// Ejs usage
app.set("view engine", "ejs");

// Layouts usage
app.use(expressLayouts);

// Buildin Middleware
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const mhs = [
    {
      nama: "Rizky",
      address: "Jakarta",
    },
    {
      nama: "Salsa",
      address: "Singapore",
    },
    {
      nama: "Horst",
      address: "Austria",
    },
    {
      nama: "Taz",
      address: "Australia",
    },
  ];
  res.render("index", {
    layout: "layouts/main-layout",
    title: "index",
    mhs,
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "about",
  });
});
app.get("/contacts", (req, res) => {
  const contacts = loadContact();
  res.render("contacts", {
    layout: "layouts/main-layout",
    title: "contact",
    contacts
  });
});


app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    layout: "layouts/main-layout",
    title: "Contact",
  });
});

// Processing form
app.post("/contact",(req, res) => {
  async function tambah(){
     await client.connect();
       const db = client.db(dbName);
       const collection = db.collection("documents");

       const insertResult = await collection.insertMany([{ a: "anji" }, { a: "anjay" }, { a: "anjuy" }]);
       console.log("Inserted documents =>", insertResult);
       return "done.";
  }
  tambah()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
console.log(req.body);
  addContact(req.body);
  res.redirect("/contacts");
});

// Deleting contact
app.get("/contact/delete/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  if (!contact) {
    res.status(404);
    res.send("<h1>404</h1>");
  } else {
    deleteContact(req.params.nama);
    res.redirect("/contacts");
  }
}) ;

// Edit contact
app.get("/contact/edit/:nama", (req, res) => {
  const contact = findContact(req.params.nama);
  res.render("edit-contact", {
    layout: "layouts/main-layout",
    title: "Edit Contact",
    contact
  });
});

// Update contact
app.post("/contact/update", (req, res)=>{
  console.log(req.body);
})


app.get("/contact/:nama", (req, res) => {
  const contact = loadContact().find((c) => c.nama.toLowerCase() === req.params.nama.toLowerCase());
  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Contact",
    contact
  });
});

app.get("/product/:id/", (req, res) => {
  res.send(`./file/contact.html", { root: __dirname } param : ${req.query.category}`);
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("404 not found");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
