cmd_Makefile := cd ..; /usr/lib/node_modules/node-gyp/gyp/gyp_main.py -fmake --ignore-environment "--toplevel-dir=." -I/home/adrian/src/capn-midnight/build/config.gypi -I/usr/lib/node_modules/node-gyp/addon.gypi -I/home/adrian/.cache/node-gyp/14.14.0/include/node/common.gypi "--depth=." "-Goutput_dir=." "--generator-output=build" "-Dlibrary=shared_library" "-Dvisibility=default" "-Dnode_root_dir=/home/adrian/.cache/node-gyp/14.14.0" "-Dnode_gyp_dir=/usr/lib/node_modules/node-gyp" "-Dnode_lib_file=/home/adrian/.cache/node-gyp/14.14.0/<(target_arch)/node.lib" "-Dmodule_root_dir=/home/adrian/src/capn-midnight" "-Dnode_engine=v8" binding.gyp