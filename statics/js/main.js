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