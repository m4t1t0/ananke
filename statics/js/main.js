'use strict';

function operateFormatter(value, row, index) {
    return [
        '<a class="ananke-action-row icon-edit" href="javascript:void(0)" title="Edit">',
        '<i class="glyphicon glyphicon-pencil"></i>',
        '</a>',
        '<a class="ananke-action-row icon-remove" href="javascript:void(0)" title="Remove">',
        '<i class="glyphicon glyphicon-trash"></i>',
        '</a>'
    ].join('');
}

window.operateEvents = {
    'click .icon-edit': function (e, value, row, index) {
        console.log(value, row, index);
    },
    'click .icon-remove': function (e, value, row, index) {
        $.ajax({
            url: '/ajax/task/' + row.id,
            type: 'DELETE',
            success: function(result) {
                $('#main-table').bootstrapTable('refresh', {});
            }
        });
    },
};

$(document).ready(function() {
    $('#add-new-button').on('click', function() {
        window.location = '/task/add';
    });

    $('#edit-form-button').on('click', function() {
        let body = {};

        body.name = $('#input-name').val();
        body.desc = $('#input-desc').val();

        $.ajax({
            url: '/ajax/task',
            type: 'POST',
            data: JSON.stringify(body),
            contentType: 'application/json',
            success: function(result) {
                window.location = '/';
            }
        });
    });
});

