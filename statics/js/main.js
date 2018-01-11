'use strict';

function operateFormatterTask(value, row, index) {
    return [
        '<a class="ananke-action-row icon-edit" id="edit-task" href="javascript:void(0)" title="Edit">',
        '<i class="glyphicon glyphicon-pencil"></i>',
        '</a>',
        '<a class="ananke-action-row icon-remove" id="remove-task" href="javascript:void(0)" title="Remove">',
        '<i class="glyphicon glyphicon-trash"></i>',
        '</a>'
    ].join('');
}

function operateFormatterSchedule(value, row, index) {
    return [
        '<a class="ananke-action-row icon-edit" id="edit-schedule" href="javascript:void(0)" title="Edit">',
        '<i class="glyphicon glyphicon-pencil"></i>',
        '</a>',
        '<a class="ananke-action-row icon-remove" id="remove-schedule" href="javascript:void(0)" title="Remove">',
        '<i class="glyphicon glyphicon-trash"></i>',
        '</a>'
    ].join('');
}

function rowStyle(row, index) {

    console.log(row);

    if (row.active == 0) {
        return {
            classes: 'execution-inactive'
        };
    }

    switch (row.status) {
        case 0:
            return {
                classes: 'execution-success'
            };
        case 1:
            return {
                classes: 'execution-error'
            };
        default:
            return {};
    }
}

window.operateEvents = {
    'click #edit-task': function (e, value, row, index) {
        $(location).attr('href', '/task/' + row.id);
    },
    'click #remove-task': function (e, value, row, index) {
        $.ajax({
            url: '/ajax/task/' + row.id,
            type: 'DELETE',
            success: function(result) {
                $('#tasks-table').bootstrapTable('refresh', {});
            }
        });
    },

    'click #edit-schedule': function (e, value, row, index) {
        $(location).attr('href', '/schedule/' + row.id);
    },
    'click #remove-schedule': function (e, value, row, index) {
        $.ajax({
            url: '/ajax/schedule/' + row.id,
            type: 'DELETE',
            success: function(result) {
                $('#schedules-table').bootstrapTable('refresh', {});
            }
        });
    }
};

$(document).ready(function() {
    $('#add-new-task-button').on('click', function() {
        window.location = '/task/add';
    });

    $('#manage-schedules-button').on('click', function() {
        window.location = '/schedules';
    });

    $('#add-new-schedule-button').on('click', function() {
        window.location = '/schedule/add';
    });

    $('#modal-close-button').on('click', function() {
        $('#modal-execution').fadeTo(100, 0);
        $('#modal-execution').hide();
    });

    $(document).on('click', '.execution-status', function(e) {
        $('#modal-execution').fadeTo(100, 1);
        $('#modal-execution').show();

        let executionId = $(this).data('taskId');
        $.ajax({
            url: '/ajax/execution/' + executionId,
            type: 'GET',
            success: function(data) {
                $('#excecution-content').html(data.data[0].output);
            }
        });

        e.preventDefault();
    });

    $('#task-edit-submit').on('click', function() {
        let body = {};
        let errorMessageContainer = $('#error-alert');

        body.id = $('#task-id').val();
        body.name = $('#task-name').val();
        body.desc = $('#task-desc').val();
        body.schedule_id = $('#task-schedule').val();
        body.command = $('#task-command').val();
        body.active = $('#task-active').is(':checked') ? 1 : 0;

        if (body.name == '' || body.desc == '' || body.schedule_id == '' || body.command == '') {
            errorMessageContainer.html('Please fill all the fields');
            errorMessageContainer.show();
            return;
        }

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

    $('#schedule-edit-submit').on('click', function() {
        let body = {};
        let errorMessageContainer = $('#error-alert');

        body.id = $('#schedule-id').val();
        body.name = $('#schedule-name').val();
        body.pattern = $('#schedule-pattern').val();

        if (body.name == '' || body.pattern == '') {
            errorMessageContainer.html('Please fill all the fields');
            errorMessageContainer.show();
            return;
        }

        $.ajax({
            url: '/ajax/schedule',
            type: 'POST',
            data: JSON.stringify(body),
            contentType: 'application/json',
            success: function(result) {
                window.location = '/schedules';
            },
            error: function(result) {
                let errorMessage = result.responseJSON.data[0].message;
                errorMessageContainer.html(errorMessage);
                errorMessageContainer.show();
            }
        });
    });

    // $.ajax({
    //     url: '/ajax/schedules',
    //     type: 'GET',
    //     success: function(data) {
    //         $.each(data.data, function (i, item) {
    //             $('#task-schedule').append($('<option>', {
    //                 value: item.id,
    //                 text : item.name + ' [ ' + item.pattern + ' ]'
    //             }));
    //         });
    //     }
    // });

    $('#tasks-table').on('load-success.bs.table', function() {
        let data = $('#tasks-table').bootstrapTable('getData');

        for (let i = 0; i < data.length; i++) {
            let dataRow = data[i];
            switch (dataRow.status) {
                case 0:
                    $('#tasks-table').bootstrapTable('updateCell', {
                        index: i,
                        field: 'status_icon',
                        value: '<a class="execution-status glyphicon glyphicon-list-alt" href="" data-task-id="' + dataRow.id + '"></a>'
                    });
                    break;
                case 1:
                    $('#tasks-table').bootstrapTable('updateCell', {
                        index: i,
                        field: 'status_icon',
                        value: '<a class="execution-status glyphicon glyphicon-list-alt" href="" data-task-id="' + dataRow.id + '"></a>'
                    });
                    break;
            }
        }
    });
});

