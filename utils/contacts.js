const fs = require("fs");
// membuat folder data jika belum ada
const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

// cek file dan buat jika tidak ada
const dataPath = "./data/contact.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}
const loadContact = () => {
  const file = fs.readFileSync("data/contact.json", "utf-8");
  const contacts = JSON.parse(file);
  return contacts;
};

const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  fs.writeFileSync("data/contact.json", JSON.stringify(contacts));
};

// Cek duplikat
const cekDuplikat = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama);
};

// Cari Nama Kontak
const findContact = (nama) => {
  const contacts = loadContact();
  return contacts.find((contact) => contact.nama === nama);
};

// Delete contact
const deleteContact = (nama) => {
  const contacts = loadContact();
  const newContacts = contacts.filter((contact) => contact.nama !== nama);
  fs.writeFileSync("data/contact.json", JSON.stringify(newContacts));
};

// Edit Contact
const editContact = (contactBaru) => {
  const contacts = loadContact();
  // hilangkan contact lama yang namanya sama dengan contactBaru
  const newContacts = contacts.filter((contact) => contact.nama !== contactBaru.nama);
  delete contactBaru.oldNama;
  newContacts.push(contactBaru);
  fs.writeFileSync("data/contact.json", JSON.stringify(newContacts));
};

module.exports = {loadContact, addContact ,cekDuplikat, findContact, deleteContact, editContact}
