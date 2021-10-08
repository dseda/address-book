$().ready(function () {
  let contacts = [];
  let $allContacts = $("#all-contacts");
  let $createContact = $("#create-contact");
  let $info = $("#info");
  let $newContactBtn = $("#create-new");
  let $contactsContainer = $("#container");
  $createContact.hide();

  class Contact {
    constructor(fname, lname, phone, address) {
      this.fname = fname;
      this.lname = lname;
      this.phone = phone;
      this.address = address;
    }

    get fullName() {
      return (
        this.fname.charAt(0).toUpperCase() +
        this.fname.slice(1).toLowerCase() +
        " " +
        this.lname.charAt(0).toUpperCase() +
        this.lname.slice(1).toLowerCase()
      );
    }
    set updateFirstName(t) {
      this.fname = t;
    }
    set updateLastName(t) {
      this.lname = t;
    }
    set updatePhone(t) {
      this.phone = t;
    }
    set updateAddress(t) {
      this.address = t;
    }
  }

  const createNewContact = (firstName, lastName, phone, address) => {
    const contact = new Contact(firstName, lastName, phone, address);
    return contact;
  };

  $("h1").click(function () {
    $("#new").trigger("reset");
    $createContact.hide();
  });
  $("h2").click(function () {
    $("#new").trigger("reset");
    $createContact.hide();
  });
  $newContactBtn.click(function () {
    $createContact.show();
  });

  const renderContact = (contact) => {
    let paragraph = $("<p>")
      .addClass("contact-info")
      .data("contact", contact)
      .text(contact.fullName + " " + contact.phone + " " + contact.address);

    let delButton = $("<button>")
      .text("delete")
      .addClass("delete")
      .prop("type", "button");

    let editButton = $("<button>")
      .text("edit")
      .addClass("edit")
      .prop("type", "button");
    return paragraph.append(editButton).append(delButton);
  };

  /////////////******** ADD NEW CONTACT *************////////
  $(document).on("submit", "#new", function () {
    // $("#new").on("submit", function (event) {
    event.preventDefault();
    let firstName = $(this).find("[name=first-name]").val().toLowerCase();
    let lastName = $(this).find("[name=last-name]").val().toLowerCase();
    let phone = $(this).find("[name=phone]").val();
    let address = $(this).find("[name=address]").val().toLowerCase();
    const contact = createNewContact(firstName, lastName, phone, address);
    contacts.push(contact);
    //Add newly created contact to All Contacts Section
    $contactsContainer.append(renderContact(contact));
    //Empty form inputs
    $(this).trigger("reset");
    $createContact.hide();
    $info.hide();
  });

  $("#cancel").click(function () {
    $("#new").trigger("reset");
    $createContact.hide();
  });

  ////////////********* DISPLAY ALL CONTACTS ********//////////

  const displayContacts = () => {
    if (!contacts.length) {
      $contactsContainer.prepend($info.show().text("No contacts found X"));
    }
    for (let c of contacts) {
      $contactsContainer.append(renderContact(c));
    }
    $contactsContainer.show();
    $allContacts.show();
  };

  /////////******** DELETE CONTACT *********///////////

  $(document).on("click", ".delete", function () {
    let $deleteBtn = $(this);
    let contact = $deleteBtn.parent().data("contact");
    if (contacts.indexOf(contact !== -1)) {
      contacts = contacts.filter((item) => item.phone !== contact.phone);
    }
    $deleteBtn.parent().remove();
    if (!contacts.length) {
      $contactsContainer.prepend($info.show().text("No contacts found Y"));
    }
  });

  /////////******** SEARCH CONTACTS *********///////////

  $("#search").on("focusin change input click", function () {
    $info.hide();
    let search = $("#search").val().toLowerCase();
    let found = contacts.find(
      (item) =>
        item.fname.includes(search) ||
        item.lname.includes(search) ||
        item.phone == search ||
        item.address.includes(search)
    );
    if (!contacts.length) {
      $contactsContainer.prepend($info.show().text("No contacts found Z"));
    } else if (search == "") {
      $contactsContainer.empty();
      displayContacts();
    } else if (found && search !== "") {
      $info.hide();
      $("#search-contacts").remove($("p"));
      $contactsContainer.empty().append(renderContact(found));
    } else {
      $contactsContainer
        .empty()
        .prepend($info.show().text(search + " not found"));
    }
  });

  $("#search").on("focusout", function () {
    let search = $("#search");
    search.val("");
    $contactsContainer.empty();
    displayContacts();
  });
  //Add dummy data
  let c1 = createNewContact("seda", "demir", "07700 000000", "london");
  contacts.push(c1);
  let c2 = createNewContact("helen", "talbot", "07700 000001", "reading");
  contacts.push(c2);
  displayContacts();
});
