'use strict';

var async = module.parent.require('async');

const plugin = {};
var app;

plugin.init = function (params, callback) {
	app = params.app;
	callback();
};

plugin.defineWidgets = function (widgets, callback) {
	var widget = {
		widget: 'lastupdated',
		name: 'Topic Last Updated',
		description: 'Displays the date when the topic was last updated',
		content: 'admin/lastupdated.tpl',
	};

	app.render(widget.content, {}, function (err, html) {
		widget.content = html;
		widgets.push(widget);
		callback(err, widgets);
	});
};

plugin.renderWidget = function (widgetRenderParams, callback) {
	if (widgetRenderParams.area.template !== 'topic.tpl') {
		return callback(null, widgetRenderParams);
	}
	async.waterfall([
		function (next) {
			const lastpost_time = new Date(widgetRenderParams.area.templateData.lastposttime);
			const english = new Intl.DateTimeFormat('en-GB', { month: 'long', day: 'numeric', year: 'numeric' });
			const last_post = english.format(lastpost_time);

			app.render('widgets/lastupdated', {
				topic: {
					last_post,
				},
			}, next);
		},
		function (html, next) {
			widgetRenderParams.html = html;
			next(null, widgetRenderParams);
		},
	], callback);
};

module.exports = plugin;
