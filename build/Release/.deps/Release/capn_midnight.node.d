cmd_Release/capn_midnight.node := ln -f "Release/obj.target/capn_midnight.node" "Release/capn_midnight.node" 2>/dev/null || (rm -rf "Release/capn_midnight.node" && cp -af "Release/obj.target/capn_midnight.node" "Release/capn_midnight.node")
