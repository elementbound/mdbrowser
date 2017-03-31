function glyphicon(glyph) {
    return $('<span>')
            .attr('aria-hidden', true)
            .addClass('glyphicon')
            .addClass(glyph);
}

function formatEntry(entry) {
    let row = $('<tr>');
    let cell = $('<td>').appendTo(row);

    if(entry.flags.drive)
        glyphicon('glyphicon-hdd').appendTo(cell);

    if(entry.flags.directory)
        glyphicon('glyphicon-plus')
            .addClass('icon-expand')
            .appendTo(cell);

    let text = $('<a>').appendTo(cell);
    text.html(entry.name);

    row.data('entry', entry);

    return row;
}

function toggleDirectory(cell) {
    var parent = cell.parent();
    var entry = parent.data('entry');

    if(cell.prop('expanded')) {
        // Collapse cell
        let children = cell.data('children');
        for(let i = 0; i < children.length; i++)
            children[i].remove();

        // Remember
        cell.removeProp('expanded');

        // Show
        cell.find('.icon-expand')
            .removeClass('glyphicon-minus')
            .addClass('glyphicon-plus');
    } else {
        var children = [];

        // Expand tree
        $.getJSON('/list/'+entry.path, undefined, function(data) {
            // Reverse-iterate entries
            for(let i = data.length; i--; ) {
                let entry = data[i];
                let row = formatEntry(entry);
                let cell = row.find('td');

                row.insertAfter(parent);
                children.push(row);

                if(entry.flags.directory)
                    cell.click(function(){toggleDirectory($(this));});
            }
        });

        // Remember
        cell.prop('expanded', true);
        cell.data('children', children);

        // Show
        cell.find('.icon-expand')
            .removeClass('glyphicon-plus')
            .addClass('glyphicon-minus');
    }
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

            cell.click(function(){toggleDirectory($(this));});
        }
    })
})
