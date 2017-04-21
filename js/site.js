const glyph_expand = 'glyphicon-chevron-down';
const glyph_collapse = 'glyphicon-chevron-up';

function glyphicon(glyph) {
    return $('<span>')
            .attr('aria-hidden', true)
            .addClass('glyphicon')
            .addClass(glyph);
}

function scrollTop() {
    $('html, body').animate({
        scrollTop: 0
    }, 500);
}

function formatEntry(entry) {
    let row = $('<tr>');
    let cell = $('<td>').appendTo(row);

    if(entry.flags.drive)
        glyphicon('glyphicon-hdd').appendTo(cell);

    if(entry.flags.directory)
        glyphicon(glyph_expand)
            .addClass('icon-expand')
            .appendTo(cell);

    if(entry.flags.markdown)
        glyphicon('glyphicon-eye-open')
            .appendTo(cell);

    let text = $('<a>').appendTo(cell);
    text.html(entry.name);

    cell.css('padding-left', (entry.depth*1.5)+'em');

    row.data('entry', entry);

    return row;
}

function patch_refs(e, base_url) {
    var r = new RegExp('^(?:[a-z]+:)?//', 'i');
    var base_url = base_url; 

    e.find('img').each(function () {
        let src = $(this).attr('src');

        if(!r.test(src))
            $(this).attr('src', '/local/' + base_url + src);
    })
}

function render(path) {
    scrollTop();
    $("#render").html('Rendering...');

    $.get('/render/'+path, undefined, function(data) {
        $('#render').html(data);

        let base_url = path;
        base_url = base_url.split('\\').join('/');
        console.log(base_url);

        base_url = base_url.split('/');
        console.log(base_url);

        base_url.pop();
        console.log(base_url);

        base_url = base_url.join('/') + '/';
        console.log(base_url);

        patch_refs($('#render'), base_url);
    })
}

function entryClick() {
    var cell = $(this);
    var row = cell.parent();
    var entry = row.data('entry');

    console.log(entry);

    if(entry.flags.directory || entry.flags.drive)
        toggleDirectory(cell);

    if(entry.flags.markdown)
        render(entry.path);
}

function collapseDirectory(cell) {
    // Remove all its children
    let children = cell.data('children');

    // Got no children to remove
    if(!children)
        return;

    for(let i = 0; i < children.length; i++) {
        let childCell = children[i].find('td');
        collapseDirectory(childCell);
        children[i].remove();
    }

    // Remember
    cell.removeProp('expanded');

    // Show
    cell.find('.icon-expand')
        .removeClass(glyph_collapse)
        .addClass(glyph_expand);
}

function expandDirectory(cell) {
    var parent = cell.parent();
    var entry = parent.data('entry');
    var children = [];

    var container_wrapper = $('<div>').appendTo(cell);
    container_wrapper.hide();

    var container_parent = $('<table>').appendTo(container_wrapper)
        .addClass('table')
        .addClass('table-striped');

    var container = $('<tbody>').appendTo(container_parent);

    // Expand tree
    $.getJSON('/list/'+entry.path, undefined, function(data) {
        // Reverse-iterate entries
        for(let i = 0; i<data.length; ++i) {
            let entry = data[i];
            let row = formatEntry(entry);
            let cell = row.find('td');

            //row.insertAfter(parent);
            container.append(row);
            children.push(row);

            cell.click(entryClick);
        }

        container_wrapper.slideDown(undefined, function() {
            // Move items from container to after parent
            for(let i = data.length; i--; ) {
                children[i].detach();
                children[i].insertAfter(parent);
            }

            // Remove container
            container_wrapper.remove();
        });
    });

    // Remember
    cell.prop('expanded', true);
    cell.data('children', children);

    // Show
    cell.find('.icon-expand')
        .removeClass(glyph_expand)
        .addClass(glyph_collapse);
}

function toggleDirectory(cell) {
    if(cell.prop('expanded'))
        collapseDirectory(cell);
    else
        expandDirectory(cell);
}

$(document).ready(function() {
    // Query root directories and add them to browse pane
    $.getJSON('/list/', undefined, function(data) {
        let fileview = $('.fileview');
        let body = fileview.find('tbody');

        for(let i = 0; i < data.length; i++) {
            let entry = data[i];
            let row = formatEntry(entry);
            let cell = row.find('td');

            row.appendTo(body);

            cell.click(entryClick);
        }
    })
})
