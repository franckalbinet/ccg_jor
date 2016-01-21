# vis.js javascript build
# run 'watch -n 1 make'

vis_dir = src

vis_src =	${vis_dir}/namespace.js\
					${vis_dir}/defaults.js\
					${vis_dir}/routers/app-router.js\
					${vis_dir}/collections/app-collection.js\
					${vis_dir}/models/app-model.js\
					${vis_dir}/app.js\

# vis.js build
vis.js: ${vis_src}
	cat > $@ $^
