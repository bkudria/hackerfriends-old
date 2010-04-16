$(document).ready(function(e) {
    buildUsersTable(true);

    $("#add_user").button({
        icons: {primary: "ui-icon-radio-on"},
        text: false,
        disabled: true
    }).click(function(e) {
        addUser($("#username").val());
        $("#username").val('');
        refreshButton($("#add_user"));
    });

    $("#username").keyup(function(e) {
        var prev = $("#prev_username").text();
        $("#prev_username").text($(this).val());
        if(prev == $(this).val()) {
            if (e.which == 13 && !$("#add_user").button("option", "disabled")) {
                addUser($(this).val());
                $(this).val('');
                refreshButton($("#add_user"));
            }
        } else {
            refreshButton($(this));
        }
    });
});

Array.prototype.contains = function (needle) {
    for (i in this) {
        if (this[i] == needle) return true;
    }
    return false;
}

Array.prototype.indexOf = function (needle) {
    for (i in this) {
        if (this[i] == needle) return i;
    }
    return false;
}

Array.prototype.remove = function (needle) {
    index = this.indexOf(needle);
    if(index) {return this.splice(index, 1);} else {return false};
}

function buildUsersTable() {
    if (!localStorage["users"]) {localStorage["users"] = "";}
    var users = localStorage["users"].split(',').sort();
    if(users.length == 1 && users[0] == "") {users = [];}
    if (!users || users.length == 0) {
        $("#message_box .ui-icon").addClass("ui-icon-info");
        $('#message_box .message').text("You haven't added any users as friends. Type a username in the box below to add more, or visit any Hacker News page and click the '+' link.");
        $("#users").hide();
        $('#message_box').addClass("ui-state-highlight").show();
    } else {
        $("#users").hide();
        $("#users tbody tr").remove();
        $.each(users, function(index, username) {
            var row = $('<tr id="'+username+'"><td class="username">'+username+'</td><td id="remove"><button>Remove</button></td>');
            $("#users tbody").append(row);
        });

        $("#users tbody tr").each(function(index, row) {
            var username = $(row).attr('id');
            $('tr#' + username + " #remove button")
            .button({icons: {primary:'ui-icon-minus'}})
            .click(function(e) {
                $(row).remove();
                removeUser(username);
            });
        });

        $("#users").show();
    }
}

function addUser(username) {
    var users = localStorage["users"].split(',');
    if(users.length == 1 && users[0] == "") {users = [];}

    if (!users.contains(username)) {
        users.push(username);
    }
    localStorage["users"] = users.sort().join(',');
    buildUsersTable();
    $("#users tr#" + username + " td.username").hide().fadeIn(1000);
    $('#message_box').hide();
}

function removeUser(username) {
    var users = localStorage["users"].split(',');
    if(users.length == 1 && users[0] == "") {users = [];}

    users.remove(username);

    localStorage["users"] = users.sort().join(',');

    buildUsersTable();
}


function refreshButton(button) {
    $("#add_user").button("option", "icons", {primary: "ui-icon-refresh"});
    $("#add_user").removeClass("valid");
    $("#add_user").removeClass("invalid");
    $("#add_user").addClass("loading");
    $.get("http://news.ycombinator.com/user", {id: button.val()}, function(data) {
        if (data == "No such user.") {
            $("#add_user").button("option", "icons", {primary: "ui-icon-help"});
            $("#add_user").button("option", "disabled", true);
            $("#add_user").removeClass("valid loading");
            $("#add_user").addClass("invalid");
        } else {
            $("#add_user").button("option", "icons", {primary: "ui-icon-check"});
            $("#add_user").button("option", "disabled", false);
            $("#add_user").removeClass("invalid loading");
            $("#add_user").addClass("valid");
        }
    });
}
