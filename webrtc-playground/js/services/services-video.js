"use strict";

angular.module('services-video', [])
    .value('LocalVideoStateManager',
    {video: {
        status: 'Offline'}
    })
;