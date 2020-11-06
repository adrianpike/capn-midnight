{
  "targets": [
    {
      "target_name": "capn_midnight",
      "sources": [ "lib/capn_midnight.cpp" ],
      "include_dirs": [ "deps/aff3ct/src/" ],
      "libraries": [
        "-L/home/adrian/src/capn-midnight/deps/aff3ct/lib/ -l:libaff3ct-2.3.5.so",
        "-Wl,-rpath,../deps/aff3ct/lib"
      ]
    }
  ]
}
