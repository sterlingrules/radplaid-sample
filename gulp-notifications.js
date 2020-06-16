var notification = {
    title: 'sterlingrules'
};

var messages = [
    'is ready',
    'is ready to go',
    'is all set',
    'is good to go',
    'is finished',
    'is done',
    'is built',
    'is looking so good',
    'is like, wow',
    'is delicious',
    'has completed'
];

module.exports = function(task, type) {
    var type   = type || 'success';
    var random = Math.floor(Math.random() * messages.length);

    if (type == 'success') {
        notification.sound   = 'Purr';
        notification.message = 'Your ' + task + ' ' + messages[random];
    } else {
        notification.sound   = 'Frog';
        notification.message = 'Error: ' + type.message;
    }

    return notification;
};
