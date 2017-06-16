angular.module('plunker', ['ui.router'])

.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  
  $stateProvider
  .state('presentation', {
    abstract: true,
    url: '/presentation/:presentation_id',
    template: '<h1>{{presentation.title}}</h1>'+
              '<nav ui-view="nav"></nav>'+
              '<p ui-view="slide"></p>',
    controller: function ($scope, presentation) {
      $scope.presentation = presentation;
    },
    resolve: {
      presentation: function ($stateParams, PresentationApi) {
        return PresentationApi.get($stateParams.presentation_id);
      }
    }
  })
  .state('presentation.slide', {
    abstract: true,
    url: '/slide/:slide_id',
    views: {
      nav: {
        template: '<div ng-repeat="slide in presentation.slides">Slide {{slide.id}}'+
                    ' <a ui-sref="presentation.slide.show({slide_id: slide.id})">'+
                      'view'+
                    '</a>'+
                    ' <a ui-sref="presentation.slide.edit({slide_id: slide.id})">'+
                      'edit'+
                    '</a>'+
                  '</div>'
      },
      slide: {
        template: '<div ui-view></div>',
        controller: function ($scope, slide) {
          $scope.slide = slide;
        },
      }
    },
    resolve: {
      slide: function ($stateParams, presentation) {
        return presentation.getSlideByPosition($stateParams.slide_id);
      }
    }
  })
  .state('presentation.slide.show', {
    url: '',
    template: '{{slide.content}}'
  })
  .state('presentation.slide.edit', {
    url: '/edit',
    template: '<textarea rows=10 cols=20 ng-model="slide.content"></textarea>'
  })
})

.service('PresentationApi', function ($q) {
  var slides = [
    {id: 0, content: 'Slide 0 content'},
    {id: 1, content: 'Slide 1 content!!!!'}
    ],
    
    presentation = {
      title: 'Presentation Title',
      slides: slides,
      getSlideByPosition: function (slide_id) {
        return slides[slide_id];
      }
    };
  
  return {
    get: function (presentation_id) {
      // just return a POJO;
      return $q.when(presentation);
    }
  };
})

.run(function($state) {
  $state.go('presentation.slide.show', { presentation_id: 1, slide_id: 0});
});