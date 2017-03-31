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

    row.attr('data-path', entry.path);

    return row;
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

            cell.click(function() {
                var cell = $(this);
                var parent = cell.parent();

                if(cell.prop('expanded')) {
                    // Collapse cell
                    cell.data('children').remove();

                    // Remember
                    cell.removeProp('expanded');
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
                        }
                    });

                    cell.prop('expanded', true);
                    cell.data('children', children);
                }
            })
        }
    })
})
