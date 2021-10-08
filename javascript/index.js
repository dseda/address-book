$().ready(function () {
  let contacts = [];
  let $allContacts = $("contacts");
  let $modifyContacts = $("#modify-contacts");
  let $info = $("#info");
  let $newContactBtn = $("#create-new");
  let $contactsContainer = $("#container");
  $modifyContacts.hide();

  class Contact {
    constructor(fname, lname, phone, address) {
      this._fname = fname;
      this._lname = lname;
      this._phone = phone;
      this._address = address;
    }

    get firstName() {
      return (
        this._fname.charAt(0).toUpperCase() + this._fname.slice(1).toLowerCase()
      );
    }
    get lastName() {
      return (
        this._lname.charAt(0).toUpperCase() + this._lname.slice(1).toLowerCase()
      );
    }
    get fullName() {
      return this.firstName + " " + this.lastName;
    }
    get phone() {
      return this._phone;
    }
    get address() {
      return this._address
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }
    set updateFirstName(t) {
      this._fname = t;
    }
    set updateLastName(t) {
      this._lname = t;
    }
    set updatePhone(t) {
      this._phone = t;
    }
    set updateAddress(t) {
      this._address = t;
    }
  }

  const createNewContact = (firstName, lastName, phone, address) => {
    return new Contact(
      firstName.toLowerCase(),
      lastName.toLowerCase(),
      phone,
      address.toLowerCase()
    );
  };

  $("h1").click(function () {
    $("form").trigger("reset");
    $modifyContacts.hide();
    $(".edit.editable").parent().removeClass("editable");
  });
  $("h2").click(function () {
    $("form").trigger("reset");
    $modifyContacts.hide();
    $(".edit.editable").parent().removeClass("editable");
  });
  $newContactBtn.click(function () {
    $modifyContacts.find($("h3")).text("Create a Contact");
    $info.hide();
    $modifyContacts.show();
    $("form").prop("id", "new");
    $(".edit.editable").parent().removeClass("editable");
    $("form").trigger("reset");
  });

  $("#cancel").click(function () {
    $("form").trigger("reset");
    $(".edit.editable").parent().removeClass("editable");
    $modifyContacts.hide();
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
  $(document).on("submit", "form#new", function (event) {
    event.preventDefault();

    let firstName = $(this).find("[name=first-name]").val();
    let lastName = $(this).find("[name=last-name]").val();
    let phone = $(this).find("[name=phone]").val();
    let address = $(this).find("[name=address]").val();
    const contact = createNewContact(firstName, lastName, phone, address);
    contacts.push(contact);
    //Add newly created contact to All Contacts Section
    $contactsContainer.append(renderContact(contact));
    //Empty form inputs
    $(this).trigger("reset");
    $modifyContacts.hide();
    $info.hide();
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
      contacts = contacts.filter((item) => item.phone !== contact._phone);
    }
    $deleteBtn.parent().remove();
    if (!contacts.length) {
      $contactsContainer.prepend($info.show().text("No contacts found Y"));
    }
    $("form").trigger("reset");
    $modifyContacts.hide();
  });

  /////////******** SEARCH CONTACTS *********///////////

  $("#search").on("focusin change input click", function () {
    $modifyContacts.hide();
    $info.hide();
    let search = $("#search").val().toLowerCase();
    let found = contacts.find(
      (item) =>
        item._fname.includes(search) ||
        item._lname.includes(search) ||
        item._phone == search ||
        item._address.includes(search)
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

  /////////******** EDIT CONTACT *********///////////
  $(document).on("click", ".edit", function () {
    $modifyContacts.find($("h3")).text("Edit Contact");
    $(".edit.editable").removeClass("editable");
    // $(event.currentTarget).addClass("editable");
    console.log($(this));
    $(this).addClass("editable");
    // $(this).parent().addClass("editable");
    $(this).parent().data("contact");
    $("form").prop("id", "edit");
    let $editForm = $("form#edit");
    let contact = $(this).parent().data("contact");
    console.log($editForm);
    $editForm.find("[name=first-name]").val(contact.firstName);
    $editForm.find("[name=last-name]").val(contact.lastName);
    $editForm.find("[name=phone]").val(contact.phone);
    $editForm.find("[name=address]").val(contact.address);
    console.log(contacts);
    $modifyContacts.show();
  });

  $(document).on("submit", "form#edit", function (event) {
    event.preventDefault();
    let contact = $(".edit.editable").parent().data("contact");
    let index = contacts.indexOf(contact);
    contacts[index].updateFirstName = $(this)
      .find("[name=first-name]")
      .val()
      .toLowerCase();
    contacts[index].updateLastName = $(this)
      .find("[name=last-name]")
      .val()
      .toLowerCase();
    contacts[index].updatePhone = $(this)
      .find("[name=phone]")
      .val()
      .toLowerCase();
    contacts[index].updateAddress = $(this)
      .find("[name=address]")
      .val()
      .toLowerCase();

    //Empty form inputs
    $("form").trigger("reset");
    $modifyContacts.hide();
    $contactsContainer.empty();
    displayContacts();
    $info.hide();
  });

  //Add dummy data
  let c1 = createNewContact("seda", "demir", "07700 000000", "london");
  contacts.push(c1);
  let c2 = createNewContact("helen", "talbot", "07700 000001", "reading");
  contacts.push(c2);
  let c3 = createNewContact("jake", "gosling", "07700 000002", "sussex");
  contacts.push(c3);
  let c4 = createNewContact("robin", "hood", "07700 000003", "kent");
  contacts.push(c4);
  displayContacts();
});
