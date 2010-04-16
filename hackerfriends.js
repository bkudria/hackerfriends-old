function render() {
    $(".add_remove").remove();
    $(".highlight").removeClass("highlight");
    $("a[href^='user?id']").each(function(index, link) {
        var username = $(link).text();
        var addremove = $('<span class="add_remove"></span>');
        var add = $('<a href="#" class="add">&nbsp;+&nbsp;</a>').click(function(e) {e.preventDefault(); chrome.extension.sendRequest({add_user: username}, function(response) {render();})});
        var remove = $('<a href="#" class="remove">&nbsp;-&nbsp;</a>').hide().click(function(e) {e.preventDefault(); chrome.extension.sendRequest({remove_user: username}, function(response) {render();})});
        $(link).after(addremove.append(add).append(remove));
    });
    chrome.extension.sendRequest({get_users: true}, function(response) {
        var users = response.users;
        $.each(users, function(index, username) {
            var linkSelector = "a[href='user?id="+username+"']";
            $(linkSelector).addClass("highlight");
            $(linkSelector).next('.add_remove').children('.add').hide();
            $(linkSelector).next('.add_remove').children('.remove').show();
            $("body center table table tr:has("+linkSelector+")").prev().addClass("highlight");
            $("body center table table table td.default:has("+linkSelector+")").addClass("highlight");
        });
    });
}

render();