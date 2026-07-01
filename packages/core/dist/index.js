// src/detect.ts
var extensionMimeMap = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  jfif: "image/jpeg",
  pjpe: "image/pjpeg",
  pjpeg: "image/pjpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  jxl: "image/jxl",
  svg: "image/svg+xml",
  bmp: "image/bmp",
  ico: "image/x-icon",
  cur: "image/x-icon",
  tif: "image/tiff",
  tiff: "image/tiff",
  apng: "image/apng",
  heic: "image/heic",
  heif: "image/heif",
  mp4: "video/mp4",
  mpg: "video/mpeg",
  mpeg: "video/mpeg",
  mpe: "video/mpeg",
  mpv: "video/mpv",
  webm: "video/webm",
  ogg: "audio/ogg",
  ogv: "video/ogg",
  mov: "video/quicktime",
  m4v: "video/x-m4v",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",
  flv: "video/x-flv",
  wmv: "video/x-ms-wmv",
  "3gp": "video/3gpp",
  "3g2": "video/3gpp2",
  m2ts: "video/mp2t",
  m3u8: "application/vnd.apple.mpegurl",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  aif: "audio/aiff",
  aiff: "audio/aiff",
  aifc: "audio/aiff",
  aac: "audio/aac",
  m4a: "audio/mp4",
  flac: "audio/flac",
  opus: "audio/opus",
  oga: "audio/ogg",
  weba: "audio/webm",
  amr: "audio/amr",
  mid: "audio/midi",
  midi: "audio/midi",
  caf: "audio/x-caf",
  au: "audio/basic",
  snd: "audio/basic",
  wma: "audio/x-ms-wma",
  pdf: "application/pdf",
  epub: "application/epub+zip",
  xps: "application/vnd.ms-xpsdocument",
  oxps: "application/oxps",
  txt: "text/plain",
  log: "text/plain",
  env: "text/plain",
  gitignore: "text/plain",
  dockerignore: "text/plain",
  npmrc: "text/plain",
  yarnrc: "text/plain",
  pnpmrc: "text/plain",
  editorconfig: "text/plain",
  browserslistrc: "text/plain",
  prettierrc: "application/json",
  eslintrc: "application/json",
  stylelintrc: "application/json",
  conf: "text/plain",
  config: "text/plain",
  properties: "text/plain",
  lock: "text/plain",
  json: "application/json",
  jsonc: "application/json",
  json5: "application/json5",
  ipynb: "application/x-ipynb+json",
  jsonl: "application/x-ndjson",
  ndjson: "application/x-ndjson",
  xml: "application/xml",
  yaml: "text/yaml",
  yml: "text/yaml",
  csv: "text/csv",
  tsv: "text/tab-separated-values",
  md: "text/markdown",
  markdown: "text/markdown",
  toml: "application/toml",
  ini: "text/plain",
  proto: "text/x-protobuf",
  tf: "text/x-hcl",
  tfvars: "text/x-hcl",
  hcl: "text/x-hcl",
  tex: "application/x-tex",
  latex: "application/x-tex",
  bib: "text/x-bibtex",
  gv: "text/vnd.graphviz",
  http: "message/http",
  css: "text/css",
  scss: "text/css",
  less: "text/css",
  js: "text/javascript",
  mjs: "text/javascript",
  cjs: "text/javascript",
  ts: "text/typescript",
  tsx: "text/typescript",
  jsx: "text/javascript",
  htm: "text/html",
  html: "text/html",
  vue: "text/plain",
  py: "text/x-python",
  java: "text/x-java-source",
  go: "text/x-go",
  rs: "text/rust",
  rb: "text/x-ruby",
  swift: "text/x-swift",
  kt: "text/x-kotlin",
  kts: "text/x-kotlin",
  scala: "text/x-scala",
  lua: "text/x-lua",
  r: "text/x-r",
  dart: "text/x-dart",
  svelte: "text/plain",
  astro: "text/plain",
  elm: "text/x-elm",
  ex: "text/x-elixir",
  exs: "text/x-elixir",
  clj: "text/x-clojure",
  cljs: "text/x-clojure",
  erl: "text/x-erlang",
  hrl: "text/x-erlang",
  fs: "text/x-fsharp",
  fsx: "text/x-fsharp",
  hs: "text/x-haskell",
  lhs: "text/x-haskell",
  php: "application/x-httpd-php",
  c: "text/x-c",
  cpp: "text/x-c++src",
  h: "text/x-c",
  hpp: "text/x-c++hdr",
  cs: "text/x-csharp",
  sql: "application/sql",
  sh: "application/x-sh",
  bash: "application/x-sh",
  zsh: "application/x-sh",
  fish: "application/x-sh",
  ps1: "text/plain",
  bat: "text/plain",
  cmd: "text/plain",
  dockerfile: "text/plain",
  nginxconf: "text/plain",
  gradle: "text/plain",
  graphql: "application/graphql",
  gql: "application/graphql",
  pem: "application/x-pem-file",
  crt: "application/x-x509-ca-cert",
  cer: "application/pkix-cert",
  ics: "text/calendar",
  vcf: "text/vcard",
  diff: "text/x-diff",
  patch: "text/x-diff",
  geojson: "application/geo+json",
  topojson: "application/topo+json",
  kml: "application/vnd.google-earth.kml+xml",
  kmz: "application/vnd.google-earth.kmz",
  gpx: "application/gpx+xml",
  shp: "application/octet-stream",
  drawio: "application/vnd.jgraph.mxfile",
  dio: "application/vnd.jgraph.mxfile",
  excalidraw: "application/vnd.excalidraw+json",
  tldraw: "application/json",
  zip: "application/zip",
  rar: "application/vnd.rar",
  "7z": "application/x-7z-compressed",
  tar: "application/x-tar",
  gz: "application/gzip",
  tgz: "application/gzip",
  bz2: "application/x-bzip2",
  xz: "application/x-xz",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  docm: "application/vnd.ms-word.document.macroenabled.12",
  dotx: "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  dotm: "application/vnd.ms-word.template.macroenabled.12",
  dot: "application/msword",
  doc: "application/msword",
  rtf: "application/rtf",
  odt: "application/vnd.oasis.opendocument.text",
  fodt: "application/vnd.oasis.opendocument.text-flat-xml",
  wps: "application/vnd.ms-works",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  xls: "application/vnd.ms-excel",
  xlt: "application/vnd.ms-excel",
  xlsm: "application/vnd.ms-excel.sheet.macroenabled.12",
  xltm: "application/vnd.ms-excel.template.macroenabled.12",
  xlsb: "application/vnd.ms-excel.sheet.binary.macroenabled.12",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  fods: "application/vnd.oasis.opendocument.spreadsheet-flat-xml",
  numbers: "application/vnd.apple.numbers",
  et: "application/vnd.ms-excel",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  pptm: "application/vnd.ms-powerpoint.presentation.macroenabled.12",
  ppsx: "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  ppsm: "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
  potx: "application/vnd.openxmlformats-officedocument.presentationml.template",
  potm: "application/vnd.ms-powerpoint.template.macroenabled.12",
  ppt: "application/vnd.ms-powerpoint",
  pps: "application/vnd.ms-powerpoint",
  odp: "application/vnd.oasis.opendocument.presentation",
  fodp: "application/vnd.oasis.opendocument.presentation-flat-xml",
  key: "application/vnd.apple.keynote",
  dps: "application/vnd.ms-powerpoint",
  eml: "message/rfc822",
  msg: "application/vnd.ms-outlook",
  mbox: "application/mbox",
  ofd: "application/ofd",
  gltf: "model/gltf+json",
  glb: "model/gltf-binary",
  stl: "model/stl",
  obj: "model/obj",
  "3ds": "model/3ds",
  fbx: "application/vnd.autodesk.fbx",
  dae: "model/vnd.collada+xml",
  ply: "application/ply",
  "3mf": "model/3mf",
  usdz: "model/vnd.usdz+zip",
  usdc: "model/vnd.usd",
  usda: "model/vnd.usd",
  usd: "model/vnd.usd",
  wrl: "model/vrml",
  vrml: "model/vrml",
  dxf: "image/vnd.dxf",
  dwg: "application/acad",
  dwf: "model/vnd.dwf",
  step: "model/step",
  stp: "model/step",
  iges: "application/iges",
  igs: "application/iges",
  ifc: "application/x-step",
  sat: "application/sat",
  sab: "application/sab",
  "x_t": "application/x-parasolid",
  "x_b": "application/x-parasolid",
  "3dm": "model/vnd.3dm",
  skp: "application/vnd.sketchup.skp",
  sldprt: "application/sldworks",
  sldasm: "application/sldworks",
  gds: "application/vnd.gds",
  oas: "application/vnd.oasis.layout",
  oasis: "application/vnd.oasis.layout",
  ttf: "font/ttf",
  otf: "font/otf",
  woff: "font/woff",
  woff2: "font/woff2",
  eot: "application/vnd.ms-fontobject",
  psd: "image/vnd.adobe.photoshop",
  psb: "image/vnd.adobe.photoshop",
  ai: "application/postscript",
  eps: "application/postscript",
  ps: "application/postscript",
  webarchive: "application/x-webarchive",
  sqlite: "application/vnd.sqlite3",
  sqlite3: "application/vnd.sqlite3",
  db: "application/vnd.sqlite3",
  wasm: "application/wasm",
  parquet: "application/vnd.apache.parquet",
  avro: "application/avro"
};
async function normalizeFile(source, fileName, mimeType) {
  if (typeof source === "string") {
    const name2 = fileName || getFileNameFromUrl(source) || "remote-file";
    const extension2 = getExtension(name2);
    return {
      source,
      name: name2,
      extension: extension2,
      mimeType: mimeType || extensionMimeMap[extension2] || "",
      url: source
    };
  }
  if (source instanceof File) {
    const extension2 = getExtension(fileName || source.name);
    return {
      source,
      name: fileName || source.name,
      extension: extension2,
      mimeType: mimeType || source.type || extensionMimeMap[extension2] || "",
      size: source.size,
      blob: source
    };
  }
  if (source instanceof Blob) {
    const name2 = fileName || "blob";
    const extension2 = getExtension(name2);
    return {
      source,
      name: name2,
      extension: extension2,
      mimeType: mimeType || source.type || extensionMimeMap[extension2] || "",
      size: source.size,
      blob: source
    };
  }
  const name = fileName || "buffer";
  const extension = getExtension(name);
  const blob = new Blob([source], { type: mimeType || extensionMimeMap[extension] || "" });
  return {
    source,
    name,
    extension,
    mimeType: blob.type,
    size: blob.size,
    blob
  };
}
function getFileNameFromUrl(source) {
  const rawName = source.split(/[?#]/, 1)[0]?.split("/").filter(Boolean).pop() || "";
  if (!rawName) {
    return "";
  }
  try {
    return decodeURIComponent(rawName);
  } catch {
    return rawName;
  }
}
function getExtension(name) {
  const clean = name.split("?")[0]?.split("#")[0] || "";
  const index = clean.lastIndexOf(".");
  return index >= 0 ? clean.slice(index + 1).toLowerCase() : "";
}
function isTextLike(file) {
  const textFileName = normalizeFileName(file.name);
  const textFileStem = textFileName.split(".")[0];
  return file.mimeType.startsWith("text/") || [
    "application/json",
    "application/json5",
    "application/x-ipynb+json",
    "application/xml",
    "application/yaml",
    "application/x-yaml",
    "application/sql",
    "application/x-sh",
    "application/x-httpd-php",
    "application/javascript",
    "application/x-javascript",
    "application/typescript",
    "application/x-typescript",
    "application/toml",
    "application/x-toml",
    "application/x-ndjson",
    "application/graphql",
    "application/x-pem-file",
    "application/x-x509-ca-cert",
    "application/pkix-cert",
    "application/x-tex",
    "message/http",
    "text/calendar",
    "text/vcard",
    "text/x-bibtex",
    "text/x-hcl",
    "text/x-protobuf",
    "text/vnd.graphviz"
  ].includes(file.mimeType) || [
    "txt",
    "json",
    "jsonc",
    "json5",
    "ipynb",
    "jsonl",
    "ndjson",
    "xml",
    "yaml",
    "yml",
    "csv",
    "log",
    "env",
    "gitignore",
    "dockerignore",
    "npmrc",
    "yarnrc",
    "pnpmrc",
    "editorconfig",
    "browserslistrc",
    "prettierrc",
    "eslintrc",
    "stylelintrc",
    "conf",
    "config",
    "properties",
    "lock",
    "md",
    "markdown",
    "js",
    "mjs",
    "cjs",
    "ts",
    "tsx",
    "jsx",
    "vue",
    "css",
    "scss",
    "less",
    "html",
    "htm",
    "toml",
    "ini",
    "proto",
    "tf",
    "tfvars",
    "hcl",
    "tex",
    "latex",
    "bib",
    "gv",
    "http",
    "java",
    "py",
    "go",
    "rs",
    "rb",
    "swift",
    "kt",
    "kts",
    "scala",
    "lua",
    "r",
    "dart",
    "svelte",
    "astro",
    "elm",
    "ex",
    "exs",
    "clj",
    "cljs",
    "erl",
    "hrl",
    "fs",
    "fsx",
    "hs",
    "lhs",
    "php",
    "c",
    "cpp",
    "h",
    "hpp",
    "cs",
    "sql",
    "sh",
    "bash",
    "zsh",
    "fish",
    "ps1",
    "bat",
    "cmd",
    "dockerfile",
    "nginxconf",
    "gradle",
    "graphql",
    "gql",
    "pem",
    "crt",
    "cer",
    "ics",
    "vcf",
    "diff",
    "patch"
  ].includes(file.extension) || [
    "dockerfile",
    "makefile",
    "rakefile",
    "gemfile",
    "procfile",
    "jenkinsfile",
    "vagrantfile",
    "brewfile",
    "podfile",
    "go.mod",
    "go.sum",
    "cargo.toml",
    "cargo.lock",
    ".gitignore",
    ".dockerignore",
    ".npmrc",
    ".yarnrc",
    ".pnpmrc",
    ".editorconfig",
    ".browserslistrc",
    ".prettierrc",
    ".eslintrc",
    ".stylelintrc"
  ].includes(textFileName) || [
    "readme",
    "changelog",
    "changes",
    "history",
    "license",
    "licence",
    "copying",
    "notice",
    "authors",
    "contributors",
    "codeowners"
  ].includes(textFileStem);
}
function normalizeFileName(name) {
  const baseName = name.split(/[\\/]/).pop() || name;
  return baseName.toLowerCase();
}

// src/dom.ts
function resolveContainer(container) {
  if (typeof container !== "string") {
    return container;
  }
  const element = document.querySelector(container);
  if (!element) {
    throw new Error(`File viewer container not found: ${container}`);
  }
  return element;
}
function applyBoxSize(element, width, height) {
  if (width !== void 0) {
    element.style.width = typeof width === "number" ? `${width}px` : width;
  }
  if (height !== void 0) {
    element.style.height = typeof height === "number" ? `${height}px` : height;
  }
}
function getElementSize(element) {
  const rect = element.getBoundingClientRect();
  return {
    width: Math.max(0, Math.round(rect.width)),
    height: Math.max(0, Math.round(rect.height))
  };
}
function createObjectUrl(file) {
  if (file.url) {
    return file.url;
  }
  if (!file.blob) {
    throw new Error("File source cannot be converted to an object URL.");
  }
  return URL.createObjectURL(file.blob);
}
function revokeObjectUrl(url, isExternal) {
  if (!isExternal) {
    URL.revokeObjectURL(url);
  }
}

// src/messages.ts
var defaultMessages = {
  "zh-CN": {
    loading: "\u6B63\u5728\u52A0\u8F7D\u9884\u89C8...",
    unsupportedTitle: "\u5F53\u524D\u6587\u4EF6\u6682\u4E0D\u652F\u6301\u5728\u7EBF\u9884\u89C8",
    downloadTitle: "\u5F53\u524D\u6587\u4EF6\u53EF\u4E0B\u8F7D\u540E\u67E5\u770B",
    downloadFile: "\u4E0B\u8F7D\u6587\u4EF6",
    file: "\u6587\u4EF6",
    unnamedFile: "\u672A\u547D\u540D\u6587\u4EF6",
    format: "\u683C\u5F0F",
    unknown: "\u672A\u77E5",
    mime: "MIME",
    undeclared: "\u672A\u58F0\u660E",
    size: "\u5927\u5C0F",
    source: "\u6765\u6E90",
    remoteUrl: "\u8FDC\u7A0B URL",
    localFile: "\u672C\u5730/\u5185\u5B58\u6587\u4EF6"
  },
  "en-US": {
    loading: "Loading preview...",
    unsupportedTitle: "Preview is not available for this file",
    downloadTitle: "This file can be downloaded and opened locally",
    downloadFile: "Download file",
    file: "File",
    unnamedFile: "Untitled file",
    format: "Format",
    unknown: "Unknown",
    mime: "MIME",
    undeclared: "Not declared",
    size: "Size",
    source: "Source",
    remoteUrl: "Remote URL",
    localFile: "Local or in-memory file"
  }
};
function resolveMessages(options) {
  return {
    ...defaultMessages[options.locale || "zh-CN"],
    ...options.messages
  };
}

// src/plugins/fallback.ts
function fallbackPlugin() {
  return {
    name: "fallback",
    match() {
      return true;
    },
    render(ctx) {
      ctx.options.onUnsupported?.(ctx.file);
      if (ctx.options.fallback === "custom" && ctx.options.renderFallback) {
        return ctx.options.renderFallback(ctx);
      }
      const url = createObjectUrl(ctx.file);
      const isExternal = Boolean(ctx.file.url);
      const panel = document.createElement("div");
      panel.className = "ofv-fallback";
      const title = document.createElement("strong");
      title.textContent = ctx.options.fallback === "download" ? ctx.options.messages.downloadTitle : ctx.options.messages.unsupportedTitle;
      const meta = createFallbackMeta(ctx.file, ctx.options.messages);
      const download = document.createElement("a");
      download.href = url;
      download.download = ctx.file.name;
      download.textContent = ctx.options.messages.downloadFile;
      panel.append(title, meta, download);
      ctx.viewport.classList.add("ofv-center");
      ctx.viewport.append(panel);
      if (ctx.options.fallback === "download") {
        download.focus();
      }
      return {
        destroy() {
          ctx.viewport.classList.remove("ofv-center");
          revokeObjectUrl(url, isExternal);
        }
      };
    }
  };
}
function createFallbackMeta(file, messages) {
  const meta = document.createElement("dl");
  meta.className = "ofv-fallback-meta";
  appendFallbackMeta(meta, messages.file, file.name || messages.unnamedFile);
  appendFallbackMeta(meta, messages.format, file.extension ? `.${file.extension}` : messages.unknown);
  appendFallbackMeta(meta, messages.mime, file.mimeType || messages.undeclared);
  appendFallbackMeta(meta, messages.size, file.size === void 0 ? messages.unknown : formatFallbackBytes(file.size));
  appendFallbackMeta(meta, messages.source, file.url ? messages.remoteUrl : messages.localFile);
  return meta;
}
function appendFallbackMeta(parent, label, value) {
  const key = document.createElement("dt");
  key.textContent = label;
  const content = document.createElement("dd");
  content.textContent = value;
  parent.append(key, content);
}
function formatFallbackBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

// src/viewer.ts
function createViewer(options) {
  const container = resolveContainer(options.container);
  applyBoxSize(container, options.width, options.height);
  container.classList.add("ofv-root");
  if (options.className) {
    container.classList.add(options.className);
  }
  const theme = applyTheme(container, options.theme || "light");
  const host = document.createElement("div");
  host.className = "ofv-host";
  const status = document.createElement("div");
  status.className = "ofv-status";
  status.hidden = true;
  const viewport = document.createElement("div");
  viewport.className = "ofv-viewport";
  const queue = normalizeQueue(options);
  let currentIndex = clampIndex(options.initialIndex || 0, queue.length);
  let currentInstance;
  const goTo = async (index) => {
    if (destroyed || queue.length === 0) {
      return;
    }
    currentIndex = clampIndex(index, queue.length);
    await renderQueueItem(currentIndex);
  };
  const toolbar = createToolbar(options.toolbar, viewport, {
    getLength: () => queue.length,
    next: () => goTo(currentIndex + 1),
    previous: () => goTo(currentIndex - 1),
    command: (command) => currentInstance?.command?.(command)
  });
  if (toolbar) {
    host.append(toolbar.element);
  }
  host.append(status, viewport);
  container.replaceChildren(host);
  const normalizedOptions = {
    ...options,
    fit: options.fit || "contain",
    fallback: options.fallback || "inline",
    zoom: normalizeInitialZoom(options.zoom),
    messages: resolveMessages(options)
  };
  let destroyed = false;
  let renderToken = 0;
  const setLoading = (loading) => {
    status.hidden = !loading;
    status.textContent = loading ? normalizedOptions.messages.loading : "";
  };
  const setError = (error) => {
    status.hidden = false;
    status.textContent = typeof error === "string" ? error : error.message;
  };
  const resize = () => {
    if (destroyed) {
      return;
    }
    const size = getElementSize(viewport);
    currentInstance?.resize?.(size);
  };
  const resizeObserver = observeResize(container, resize);
  const renderFile = async (file, token = ++renderToken) => {
    if (destroyed || token !== renderToken) {
      return;
    }
    destroyPreviewInstance(currentInstance);
    currentInstance = void 0;
    viewport.replaceChildren();
    setLoading(true);
    toolbar?.update(file, currentIndex, queue.length);
    const plugins = [...options.plugins || [], fallbackPlugin()];
    const plugin = await findPlugin(plugins, file);
    if (destroyed || token !== renderToken) {
      return;
    }
    try {
      const nextInstance = await plugin.render({
        host,
        viewport,
        file,
        size: getElementSize(viewport),
        options: normalizedOptions,
        toolbar: toolbar?.getContext(),
        setLoading,
        setError
      });
      if (destroyed || token !== renderToken) {
        destroyPreviewInstance(nextInstance);
        return;
      }
      currentInstance = nextInstance;
      setLoading(false);
      toolbar?.setCommandSupport(
        (command) => Boolean(nextInstance.command) && (nextInstance.canCommand ? nextInstance.canCommand(command) : true)
      );
      options.onLoad?.(file);
      resize();
    } catch (error) {
      if (destroyed || token !== renderToken) {
        return;
      }
      const normalizedError = error instanceof Error ? error : new Error(String(error));
      viewport.replaceChildren();
      setLoading(false);
      setError(normalizedError);
      options.onError?.(normalizedError, file);
    }
  };
  async function renderQueueItem(index) {
    const token = ++renderToken;
    const item = queue[index];
    const file = await normalizeFile(item.file, item.fileName, item.mimeType);
    if (destroyed || token !== renderToken) {
      return;
    }
    await renderFile(file, token);
  }
  void goTo(currentIndex);
  return {
    async reload(file) {
      if (destroyed) {
        return;
      }
      if (file !== void 0) {
        const currentItem = queue[currentIndex];
        queue.splice(currentIndex, 1, createReloadItem(file, currentItem, options));
      }
      await renderQueueItem(currentIndex);
    },
    async next() {
      await goTo(currentIndex + 1);
    },
    async previous() {
      await goTo(currentIndex - 1);
    },
    goTo,
    getCurrentIndex() {
      return currentIndex;
    },
    resize,
    destroy() {
      destroyed = true;
      renderToken += 1;
      resizeObserver.destroy();
      destroyPreviewInstance(currentInstance);
      toolbar?.destroy();
      theme.destroy();
      container.replaceChildren();
      container.classList.remove("ofv-root");
      if (options.className) {
        container.classList.remove(options.className);
      }
    }
  };
}
function destroyPreviewInstance(instance) {
  if (!instance) {
    return;
  }
  try {
    instance.destroy();
  } catch (error) {
    console.error("Failed to destroy file preview instance:", error);
  }
}
function normalizeQueue(options) {
  if (options.files && options.files.length > 0) {
    return options.files.map(
      (item) => isPreviewItem(item) ? item : {
        file: item
      }
    );
  }
  if (options.file === void 0) {
    throw new Error("File viewer requires either file or files.");
  }
  return [
    {
      file: options.file,
      fileName: options.fileName,
      mimeType: options.mimeType
    }
  ];
}
function isPreviewItem(item) {
  return typeof item === "object" && item !== null && "file" in item;
}
function createReloadItem(file, currentItem, options) {
  if (typeof File !== "undefined" && file instanceof File) {
    return { file };
  }
  return {
    file,
    fileName: currentItem?.fileName || options.fileName,
    mimeType: currentItem?.mimeType || options.mimeType
  };
}
function clampIndex(index, length) {
  if (length <= 0) {
    return 0;
  }
  return Math.min(Math.max(index, 0), length - 1);
}
function normalizeInitialZoom(zoom) {
  return typeof zoom === "number" && Number.isFinite(zoom) && zoom > 0 ? zoom : 1;
}
function applyTheme(container, theme) {
  const media = window.matchMedia?.("(prefers-color-scheme: dark)");
  const classes = ["ofv-theme-light", "ofv-theme-dark"];
  const setThemeClass = () => {
    container.classList.remove(...classes);
    const resolvedTheme = theme === "auto" && media?.matches ? "dark" : theme === "auto" ? "light" : theme;
    container.classList.add(`ofv-theme-${resolvedTheme}`);
  };
  setThemeClass();
  if (theme === "auto") {
    addMediaListener(media, setThemeClass);
  }
  return {
    destroy() {
      if (theme === "auto") {
        removeMediaListener(media, setThemeClass);
      }
      container.classList.remove(...classes);
    }
  };
}
function observeResize(element, callback) {
  if (typeof ResizeObserver !== "undefined") {
    const observer = new ResizeObserver(callback);
    observer.observe(element);
    return {
      destroy() {
        observer.disconnect();
      }
    };
  }
  window.addEventListener("resize", callback);
  return {
    destroy() {
      window.removeEventListener("resize", callback);
    }
  };
}
function addMediaListener(media, listener) {
  if (!media) {
    return;
  }
  if (typeof media.addEventListener === "function") {
    media.addEventListener("change", listener);
    return;
  }
  media.addListener?.(listener);
}
function removeMediaListener(media, listener) {
  if (!media) {
    return;
  }
  if (typeof media.removeEventListener === "function") {
    media.removeEventListener("change", listener);
    return;
  }
  media.removeListener?.(listener);
}
function createToolbar(toolbar, viewport, queue) {
  if (!toolbar) {
    return void 0;
  }
  const options = typeof toolbar === "boolean" ? { zoom: true, rotate: true, download: true, fullscreen: true, print: true, search: true } : toolbar;
  const element = document.createElement("div");
  element.className = "ofv-toolbar";
  element.setAttribute("role", "toolbar");
  element.setAttribute("aria-label", "File preview toolbar");
  let file;
  let currentIndex = 0;
  let currentLength = queue.getLength();
  let queueLabel;
  let previousButton;
  let nextButton;
  let zoomResetButton;
  let currentZoom;
  const commandButtons = [];
  const customButtons = [];
  const disposers = [];
  const search = createSearchController(viewport);
  let searchInput;
  let searchCount;
  let canRunCommand = (_command) => false;
  const getContext = () => createToolbarContext({
    file,
    index: currentIndex,
    length: currentLength,
    viewport,
    queue,
    element,
    search,
    canCommand: canRunCommand,
    refreshCommandSupport,
    zoom: currentZoom,
    setZoom
  });
  const addButton = (label, title, action, className, icon) => {
    const button = document.createElement("button");
    button.type = "button";
    setToolbarButtonContent(button, label, icon);
    button.title = title;
    button.setAttribute("aria-label", title);
    if (className) {
      button.className = className;
    }
    button.addEventListener("click", action);
    element.append(button);
    disposers.push(() => button.removeEventListener("click", action));
    return button;
  };
  const addCommandButton = (id, label, title, command) => {
    const button = addButton(label, title, () => {
      queue.command(command);
    }, void 0, options.icons?.[id]);
    button.disabled = true;
    commandButtons.push({ button, command });
  };
  const renderDefaultAction = (id) => {
    if (!isBuiltInToolbarAction(id)) {
      const customAction = options.actions?.find((action) => action.id === id);
      if (customAction) {
        renderCustomAction(customAction);
      }
      return;
    }
    if (id === "previous" && queue.getLength() > 1) {
      previousButton = addButton(
        getToolbarLabel(options, "previous"),
        getToolbarTitle(options, "previous"),
        () => void queue.previous(),
        void 0,
        options.icons?.previous
      );
      return;
    }
    if (id === "next" && queue.getLength() > 1) {
      nextButton = addButton(
        getToolbarLabel(options, "next"),
        getToolbarTitle(options, "next"),
        () => void queue.next(),
        void 0,
        options.icons?.next
      );
      return;
    }
    if (id === "queue" && queue.getLength() > 1) {
      queueLabel = document.createElement("span");
      queueLabel.className = "ofv-toolbar-queue";
      element.append(queueLabel);
      return;
    }
    if (id === "zoom-out" && options.zoom) {
      addCommandButton(id, getToolbarLabel(options, id), getToolbarTitle(options, id), "zoom-out");
      return;
    }
    if (id === "zoom-in" && options.zoom) {
      addCommandButton(id, getToolbarLabel(options, id), getToolbarTitle(options, id), "zoom-in");
      return;
    }
    if (id === "zoom-reset" && options.zoom) {
      addCommandButton(id, getToolbarLabel(options, id), getToolbarTitle(options, id), "zoom-reset");
      zoomResetButton = commandButtons[commandButtons.length - 1]?.button;
      updateZoomLabel();
      return;
    }
    if (id === "rotate-right" && options.rotate) {
      addCommandButton(id, getToolbarLabel(options, id), getToolbarTitle(options, id), "rotate-right");
      return;
    }
    if (id === "download" && options.download !== false) {
      addButton(
        getToolbarLabel(options, id),
        getToolbarTitle(options, id),
        () => getContext().download(),
        void 0,
        options.icons?.download
      );
      return;
    }
    if (id === "fullscreen" && options.fullscreen !== false) {
      addButton(
        getToolbarLabel(options, id),
        getToolbarTitle(options, id),
        () => getContext().fullscreen(),
        void 0,
        options.icons?.fullscreen
      );
      return;
    }
    if (id === "print" && options.print) {
      addButton(
        getToolbarLabel(options, id),
        getToolbarTitle(options, id),
        () => getContext().print(),
        void 0,
        options.icons?.print
      );
      return;
    }
    if (id === "search" && options.search !== false) {
      renderSearchControl();
      return;
    }
  };
  const renderCustomAction = (action) => {
    const button = addButton(
      action.label,
      action.title || action.label,
      () => void action.onClick(getContext()),
      action.className,
      action.icon
    );
    button.dataset.ofvToolbarAction = action.id;
    customButtons.push({ button, action });
  };
  const renderSearchControl = () => {
    const searchGroup = document.createElement("div");
    searchGroup.className = "ofv-toolbar-search";
    searchGroup.title = getToolbarTitle(options, "search");
    const nextSearchInput = document.createElement("input");
    nextSearchInput.type = "search";
    nextSearchInput.placeholder = getToolbarLabel(options, "search");
    nextSearchInput.setAttribute("aria-label", getToolbarTitle(options, "search"));
    const nextSearchCount = document.createElement("span");
    nextSearchCount.className = "ofv-toolbar-search-count";
    searchInput = nextSearchInput;
    searchCount = nextSearchCount;
    const runSearch = () => {
      const count = search.search(nextSearchInput.value);
      nextSearchCount.textContent = nextSearchInput.value ? String(count) : "";
    };
    nextSearchInput.addEventListener("input", runSearch);
    searchGroup.append(nextSearchInput, nextSearchCount);
    element.append(searchGroup);
    disposers.push(() => nextSearchInput.removeEventListener("input", runSearch));
  };
  const renderToolbar = () => {
    if (options.render) {
      element.replaceChildren();
      const customElement = options.render(getContext());
      if (customElement) {
        element.append(customElement);
      }
      return;
    }
    getToolbarOrder(options, queue.getLength()).forEach(renderDefaultAction);
    getImplicitCustomActions(options).forEach(renderCustomAction);
  };
  renderToolbar();
  const updateCustomButtons = () => {
    const context = getContext();
    for (const { button, action } of customButtons) {
      button.disabled = evaluateToolbarFlag(action.disabled, context);
      button.hidden = evaluateToolbarFlag(action.hidden, context);
    }
  };
  const resetSearch = () => {
    search.clear();
    if (searchInput) {
      searchInput.value = "";
    }
    if (searchCount) {
      searchCount.textContent = "";
    }
  };
  function setZoom(zoom) {
    currentZoom = typeof zoom === "number" && Number.isFinite(zoom) && zoom > 0 ? zoom : void 0;
    updateZoomLabel();
    updateCustomButtons();
    refreshCustomRender();
  }
  function updateZoomLabel() {
    if (!zoomResetButton) {
      return;
    }
    setToolbarButtonContent(
      zoomResetButton,
      currentZoom === void 0 ? getToolbarLabel(options, "zoom-reset") : formatToolbarZoom(currentZoom),
      options.icons?.["zoom-reset"]
    );
  }
  function refreshCommandSupport() {
    commandButtons.forEach(({ button, command }) => {
      button.disabled = !canRunCommand(command);
    });
    updateCustomButtons();
    refreshCustomRender();
  }
  const refreshCustomRender = () => {
    if (!options.render) {
      return;
    }
    element.replaceChildren();
    const customElement = options.render(getContext());
    if (customElement) {
      element.append(customElement);
    }
  };
  return {
    element,
    update(nextFile, index, length) {
      file = nextFile;
      currentIndex = index;
      currentLength = length;
      currentZoom = void 0;
      updateZoomLabel();
      resetSearch();
      commandButtons.forEach(({ button }) => {
        button.disabled = true;
      });
      if (queueLabel) {
        queueLabel.textContent = `${index + 1} / ${length}`;
      }
      if (previousButton) {
        previousButton.disabled = index <= 0;
      }
      if (nextButton) {
        nextButton.disabled = index >= length - 1;
      }
      updateCustomButtons();
      refreshCustomRender();
    },
    setCommandSupport(isSupported) {
      canRunCommand = isSupported;
      if (!canRunCommand("zoom-in") && !canRunCommand("zoom-out") && !canRunCommand("zoom-reset")) {
        currentZoom = void 0;
        updateZoomLabel();
      }
      refreshCommandSupport();
    },
    getContext,
    setZoom,
    destroy() {
      search.clear();
      for (const dispose of disposers) {
        dispose();
      }
      element.replaceChildren();
    }
  };
}
function createToolbarContext({
  file,
  index,
  length,
  viewport,
  queue,
  element,
  search,
  canCommand,
  refreshCommandSupport,
  zoom,
  setZoom
}) {
  return {
    file,
    index,
    length,
    viewport,
    canPrevious: index > 0,
    canNext: index < length - 1,
    zoom,
    zoomLabel: zoom === void 0 ? void 0 : formatToolbarZoom(zoom),
    async previous() {
      await queue.previous();
    },
    async next() {
      await queue.next();
    },
    command: queue.command,
    canCommand,
    refreshCommandSupport,
    setZoom,
    download() {
      if (file) {
        downloadFile(file);
      }
    },
    fullscreen() {
      void element.parentElement?.requestFullscreen?.();
    },
    print() {
      printPreview(viewport);
    },
    search: search.search,
    clearSearch: search.clear
  };
}
var defaultToolbarLabels = {
  previous: "Prev",
  next: "Next",
  queue: "",
  "zoom-out": "-",
  "zoom-in": "+",
  "zoom-reset": "100%",
  "rotate-right": "Rotate",
  download: "Download",
  fullscreen: "Fullscreen",
  print: "Print",
  search: "Search"
};
var defaultToolbarTitles = {
  previous: "Previous file",
  next: "Next file",
  queue: "Current file position",
  "zoom-out": "Zoom out",
  "zoom-in": "Zoom in",
  "zoom-reset": "Reset zoom",
  "rotate-right": "Rotate right",
  download: "Download file",
  fullscreen: "Open preview fullscreen",
  print: "Print preview",
  search: "Search preview text"
};
function getToolbarLabel(options, id) {
  return options.labels?.[id] ?? defaultToolbarLabels[id];
}
function getToolbarTitle(options, id) {
  return options.titles?.[id] ?? options.labels?.[id] ?? defaultToolbarTitles[id];
}
function formatToolbarZoom(zoom) {
  return `${Math.round(zoom * 100)}%`;
}
function getToolbarOrder(options, queueLength) {
  if (options.order) {
    return options.order;
  }
  const actions = [];
  if (queueLength > 1) {
    actions.push("previous", "next", "queue");
  }
  if (options.zoom) {
    actions.push("zoom-out", "zoom-in", "zoom-reset");
  }
  if (options.rotate) {
    actions.push("rotate-right");
  }
  if (options.download !== false) {
    actions.push("download");
  }
  if (options.fullscreen !== false) {
    actions.push("fullscreen");
  }
  if (options.print) {
    actions.push("print");
  }
  if (options.search !== false) {
    actions.push("search");
  }
  return actions;
}
function getImplicitCustomActions(options) {
  if (options.order || !options.actions) {
    return [];
  }
  return [...options.actions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
function evaluateToolbarFlag(value, context) {
  return typeof value === "function" ? value(context) : Boolean(value);
}
function setToolbarButtonContent(button, label, icon) {
  button.replaceChildren();
  if (!icon) {
    button.textContent = label;
    return;
  }
  const iconElement = document.createElement("span");
  iconElement.className = "ofv-toolbar-icon";
  iconElement.setAttribute("aria-hidden", "true");
  if (typeof icon === "string") {
    iconElement.append(sanitizeToolbarIcon(icon));
  } else {
    iconElement.append(icon.cloneNode(true));
  }
  const labelElement = document.createElement("span");
  labelElement.className = "ofv-toolbar-label";
  labelElement.textContent = label;
  button.append(iconElement, labelElement);
}
var allowedToolbarIconTags = /* @__PURE__ */ new Set([
  "svg",
  "g",
  "path",
  "circle",
  "rect",
  "line",
  "polyline",
  "polygon",
  "ellipse",
  "defs",
  "title",
  "desc"
]);
var allowedToolbarIconAttrs = /* @__PURE__ */ new Set([
  "aria-hidden",
  "class",
  "cx",
  "cy",
  "d",
  "fill",
  "focusable",
  "height",
  "id",
  "points",
  "r",
  "rx",
  "ry",
  "stroke",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-width",
  "transform",
  "viewBox",
  "width",
  "x",
  "x1",
  "x2",
  "y",
  "y1",
  "y2"
]);
function sanitizeToolbarIcon(icon) {
  const template = document.createElement("template");
  template.innerHTML = icon.trim();
  const fragment = document.createDocumentFragment();
  for (const child of Array.from(template.content.childNodes)) {
    const sanitized = sanitizeToolbarIconNode(child);
    if (sanitized) {
      fragment.append(sanitized);
    }
  }
  return fragment;
}
function sanitizeToolbarIconNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || "";
    return text.trim() ? document.createTextNode(text) : null;
  }
  if (!(node instanceof Element)) {
    return null;
  }
  const tagName = node.tagName.toLowerCase();
  if (!allowedToolbarIconTags.has(tagName)) {
    return null;
  }
  const sanitized = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  for (const attr of Array.from(node.attributes)) {
    if (isSafeToolbarIconAttribute(attr.name, attr.value)) {
      sanitized.setAttribute(attr.name, attr.value);
    }
  }
  for (const child of Array.from(node.childNodes)) {
    const sanitizedChild = sanitizeToolbarIconNode(child);
    if (sanitizedChild) {
      sanitized.append(sanitizedChild);
    }
  }
  return sanitized;
}
function isSafeToolbarIconAttribute(name, value) {
  const attrName = name.toLowerCase();
  if (attrName.startsWith("on") || attrName.includes(":")) {
    return false;
  }
  if (!allowedToolbarIconAttrs.has(name) && !allowedToolbarIconAttrs.has(attrName) && !attrName.startsWith("data-")) {
    return false;
  }
  return !/^\s*(?:javascript|data:text\/html|vbscript):/i.test(value);
}
function isBuiltInToolbarAction(id) {
  return id in defaultToolbarLabels;
}
function createSearchController(root) {
  const markerClass = "ofv-search-match";
  const clear = () => {
    const markers = collectSearchRoots(root).flatMap((searchRoot) => [
      ...searchRoot.querySelectorAll(`mark.${markerClass}`)
    ]);
    for (const marker of markers) {
      marker.replaceWith(document.createTextNode(marker.textContent || ""));
    }
    collectSearchRoots(root).forEach((searchRoot) => searchRoot.normalize());
  };
  const search = (query) => {
    clear();
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      return 0;
    }
    const textNodes = collectSearchRoots(root).flatMap((searchRoot) => collectSearchableTextNodes(searchRoot));
    let count = 0;
    let firstMatch;
    for (const node of textNodes) {
      const text = node.nodeValue || "";
      const lowerText = text.toLowerCase();
      const lowerQuery = normalizedQuery.toLowerCase();
      let start = 0;
      let index = lowerText.indexOf(lowerQuery, start);
      if (index < 0) {
        continue;
      }
      const fragment = document.createDocumentFragment();
      while (index >= 0) {
        if (index > start) {
          fragment.append(document.createTextNode(text.slice(start, index)));
        }
        const marker = document.createElement("mark");
        marker.className = markerClass;
        marker.textContent = text.slice(index, index + normalizedQuery.length);
        fragment.append(marker);
        firstMatch ||= marker;
        count += 1;
        start = index + normalizedQuery.length;
        index = lowerText.indexOf(lowerQuery, start);
      }
      if (start < text.length) {
        fragment.append(document.createTextNode(text.slice(start)));
      }
      node.replaceWith(fragment);
    }
    firstMatch?.scrollIntoView?.({ block: "center", inline: "nearest" });
    return count;
  };
  return { search, clear };
}
function collectSearchRoots(root) {
  const roots = [root];
  for (const iframe of root.querySelectorAll("iframe")) {
    try {
      const body = iframe.contentDocument?.body;
      if (body) {
        roots.push(body);
      }
    } catch {
    }
  }
  return roots;
}
function collectSearchableTextNodes(root) {
  const nodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || !node.nodeValue?.trim()) {
        return NodeFilter.FILTER_REJECT;
      }
      if (["SCRIPT", "STYLE", "TEXTAREA", "INPUT", "BUTTON"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  let current = walker.nextNode();
  while (current) {
    nodes.push(current);
    current = walker.nextNode();
  }
  return nodes;
}
function printPreview(viewport) {
  const frame = document.createElement("iframe");
  frame.className = "ofv-print-frame";
  frame.setAttribute("aria-hidden", "true");
  document.body.append(frame);
  const clone = viewport.cloneNode(true);
  copyCanvasContent(viewport, clone);
  clone.classList.add("ofv-print-root", "ofv-root");
  const pptxViewer = clone.querySelector(".ofv-pptx-viewer") || (clone.classList.contains("ofv-pptx-viewer") ? clone : null);
  let intrinsicWidth = 960;
  let intrinsicHeight = 540;
  let hasSlides = false;
  if (pptxViewer) {
    const slides = pptxViewer.querySelectorAll("[data-slide-index]");
    if (slides.length > 0) {
      hasSlides = true;
      const firstWrapper = slides[0].firstElementChild;
      const firstSlide = firstWrapper?.firstElementChild;
      if (firstSlide) {
        intrinsicWidth = parseInt(firstSlide.style.width) || 960;
        intrinsicHeight = parseInt(firstSlide.style.height) || 540;
      }
      slides.forEach((slideEl) => {
        const item = slideEl;
        item.style.width = "100%";
        item.style.margin = "0 0 20px 0";
        const wrapper = item.firstElementChild;
        if (wrapper) {
          wrapper.style.width = `${intrinsicWidth}px`;
          wrapper.style.height = `${intrinsicHeight}px`;
          wrapper.style.boxShadow = "none";
          wrapper.style.margin = "0 auto";
          const slideContent = wrapper.firstElementChild;
          if (slideContent) {
            slideContent.style.transform = "none";
            slideContent.style.width = `${intrinsicWidth}px`;
            slideContent.style.height = `${intrinsicHeight}px`;
          }
        }
      });
    }
  }
  const doc = frame.contentDocument;
  if (!doc) {
    frame.remove();
    return;
  }
  doc.open();
  doc.write(`<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Print preview</title>
      </head>
      <body></body>
    </html>`);
  doc.close();
  Array.from(document.querySelectorAll("style, link[rel='stylesheet']")).forEach((el) => {
    doc.head.appendChild(el.cloneNode(true));
  });
  const baseStyle = doc.createElement("style");
  baseStyle.textContent = `
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      color: #111827;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    body { padding: 16px; }
    img, video, canvas, svg { max-width: 100%; }
    pre {
      white-space: pre-wrap;
      word-break: break-word;
      font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .ofv-viewport, .ofv-print-root {
      width: 100% !important;
      height: auto !important;
      overflow: visible !important;
      background: #fff !important;
      color: #111827 !important;
      border: none !important;
      box-shadow: none !important;
    }
    .ofv-pdf {
      padding: 0;
      overflow: visible;
      background: #fff;
    }
    .ofv-pdf-page {
      display: block;
      max-width: 100%;
      height: auto;
      margin: 0 auto 16px;
      box-shadow: none;
    }
    .ofv-panel,
    .ofv-text,
    .ofv-text-block,
    .ofv-file-list {
      max-height: none;
      min-height: 0;
      overflow: visible;
    }
    .ofv-section {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  `;
  doc.head.appendChild(baseStyle);
  if (hasSlides) {
    const pptxStyle = doc.createElement("style");
    pptxStyle.textContent = `
      @media print {
        @page {
          size: ${intrinsicWidth > intrinsicHeight ? "landscape" : "portrait"};
          margin: 0;
        }
        html, body {
          background: #fff;
        }
        body {
          width: ${intrinsicWidth}px !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .ofv-print-root {
          width: ${intrinsicWidth}px !important;
          padding: 0 !important;
        }
        .ofv-pptx-viewer {
          width: ${intrinsicWidth}px !important;
          padding: 0 !important;
          background: #fff !important;
          overflow: visible !important;
        }
        .ofv-pptx-viewer > div[data-slide-index] {
          page-break-after: always;
          break-after: page;
          break-inside: avoid;
          page-break-inside: avoid;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
        }
        .ofv-pptx-viewer > div[data-slide-index]:last-child {
          page-break-after: avoid;
          break-after: avoid;
        }
      }
    `;
    doc.head.appendChild(pptxStyle);
  }
  doc.body.append(clone);
  let printed = false;
  const printAndCleanup = () => {
    if (printed) {
      return;
    }
    printed = true;
    frame.contentWindow?.focus();
    frame.contentWindow?.print();
    window.setTimeout(() => frame.remove(), 1e3);
  };
  frame.onload = () => {
    printAndCleanup();
  };
  window.setTimeout(() => {
    printAndCleanup();
  }, 100);
}
function copyCanvasContent(sourceRoot, targetRoot) {
  const sourceCanvases = [...sourceRoot.querySelectorAll("canvas")];
  const targetCanvases = [...targetRoot.querySelectorAll("canvas")];
  sourceCanvases.forEach((sourceCanvas, index) => {
    const targetCanvas = targetCanvases[index];
    if (!targetCanvas) {
      return;
    }
    const image = document.createElement("img");
    image.className = targetCanvas.className;
    image.alt = "Canvas preview page";
    try {
      image.src = sourceCanvas.toDataURL("image/png");
    } catch {
      return;
    }
    image.width = sourceCanvas.width;
    image.height = sourceCanvas.height;
    targetCanvas.replaceWith(image);
  });
}
function downloadFile(file) {
  const url = createObjectUrl(file);
  const isExternal = Boolean(file.url);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.rel = "noopener";
  link.hidden = true;
  document.body.append(link);
  link.click();
  window.setTimeout(() => {
    link.remove();
    revokeObjectUrl(url, isExternal);
  }, 0);
}
async function findPlugin(plugins, file) {
  for (const plugin of plugins) {
    if (await plugin.match(file)) {
      return plugin;
    }
  }
  return fallbackPlugin();
}

// src/plugins/utils.ts
async function readArrayBuffer(file) {
  if (file.source instanceof ArrayBuffer) {
    return file.source;
  }
  if (file.blob) {
    return file.blob.arrayBuffer();
  }
  if (typeof file.source === "string") {
    const response = await fetch(file.source);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }
    return response.arrayBuffer();
  }
  throw new Error("Unsupported file source.");
}
async function readTextFile(file) {
  const decode = (buffer) => decodeTextBuffer(buffer);
  if (typeof file.source === "string") {
    const response = await fetch(file.source);
    if (!response.ok) {
      throw new Error(`Failed to fetch text file: ${response.status}`);
    }
    return decode(await response.arrayBuffer());
  }
  if (file.blob) {
    return decode(await file.blob.arrayBuffer());
  }
  if (file.source instanceof ArrayBuffer) {
    return decode(file.source);
  }
  return String(file.source);
}
function createPanel(className = "") {
  const panel = document.createElement("div");
  panel.className = `ofv-panel ${className}`.trim();
  return panel;
}
function getInitialZoom(ctx, min = 0.1, max = 8) {
  return Math.min(max, Math.max(min, ctx.options.zoom));
}
function createSection(title) {
  const section = document.createElement("section");
  section.className = "ofv-section";
  const heading = document.createElement("h3");
  heading.textContent = title;
  section.append(heading);
  return section;
}
function appendMeta(parent, label, value) {
  const row = document.createElement("div");
  row.className = "ofv-meta-row";
  const key = document.createElement("span");
  key.textContent = label;
  const content = document.createElement("strong");
  content.textContent = String(value);
  row.append(key, content);
  parent.append(row);
}
function decodeTextBuffer(buffer) {
  return decodeTextBytes(new Uint8Array(buffer));
}
function decodeTextBytes(bytes) {
  if (bytes.length >= 3 && bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191) {
    return new TextDecoder("utf-8").decode(bytes.subarray(3));
  }
  if (bytes.length >= 2) {
    if (bytes[0] === 255 && bytes[1] === 254) {
      return new TextDecoder("utf-16le").decode(bytes.subarray(2));
    }
    if (bytes[0] === 254 && bytes[1] === 255) {
      return new TextDecoder("utf-16be").decode(bytes.subarray(2));
    }
  }
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return decodeWithFallback(bytes, "gb18030") || decodeWithFallback(bytes, "gbk") || new TextDecoder("utf-8").decode(bytes);
  }
}
function decodeWithFallback(bytes, encoding) {
  try {
    return new TextDecoder(encoding).decode(bytes);
  } catch {
    return void 0;
  }
}
function resolveFormat(file, mimeMap) {
  return file.extension || mimeMap[file.mimeType] || "";
}

// src/plugins/image.ts
var imageExtensions = /* @__PURE__ */ new Set([
  "jpg",
  "jpeg",
  "jfif",
  "pjpe",
  "pjpeg",
  "png",
  "gif",
  "webp",
  "avif",
  "jxl",
  "svg",
  "bmp",
  "ico",
  "cur",
  "tif",
  "tiff",
  "apng",
  "heic",
  "heif"
]);
var nonRasterImageExtensions = /* @__PURE__ */ new Set(["dxf"]);
var nonRasterImageMimeTypes = /* @__PURE__ */ new Set(["image/vnd.dxf", "image/vnd.adobe.photoshop"]);
var heicMimeTypes = /* @__PURE__ */ new Set(["image/heic", "image/heif", "image/heic-sequence", "image/heif-sequence"]);
function imagePlugin() {
  return {
    name: "image",
    match(file) {
      if (nonRasterImageExtensions.has(file.extension) || nonRasterImageMimeTypes.has(file.mimeType)) {
        return false;
      }
      return file.mimeType.startsWith("image/") || imageExtensions.has(file.extension);
    },
    async render(ctx) {
      const ext = ctx.file.extension.toLowerCase();
      const isHeic = ext === "heic" || ext === "heif" || heicMimeTypes.has(ctx.file.mimeType.toLowerCase());
      const isTiff = ext === "tif" || ext === "tiff" || ctx.file.mimeType.toLowerCase() === "image/tiff";
      const sourceBytesPromise = readImageBytes(ctx.file);
      let url = "";
      let convertedBlob = null;
      let isExternal = Boolean(ctx.file.url);
      let canvasSource = null;
      if (isTiff) {
        ctx.setLoading(true);
        try {
          const bytes = await sourceBytesPromise;
          canvasSource = await createTiffCanvas(bytes);
        } catch (err) {
          console.error("TIFF image conversion failed:", err);
          url = createObjectUrl(ctx.file);
        } finally {
          ctx.setLoading(false);
        }
      } else if (isHeic) {
        ctx.setLoading(true);
        try {
          let blob = ctx.file.blob;
          if (!blob && typeof ctx.file.source === "string") {
            const res = await fetch(ctx.file.source);
            if (!res.ok) {
              throw new Error(`Failed to fetch HEIC file: ${res.status}`);
            }
            blob = await res.blob();
          }
          if (!blob) {
            throw new Error("HEIC file source cannot be resolved to a Blob.");
          }
          const heic2anyModule = await import("heic2any");
          const heic2any = heic2anyModule.default || heic2anyModule;
          const converted = await heic2any({
            blob,
            toType: "image/jpeg",
            quality: 0.8
          });
          convertedBlob = Array.isArray(converted) ? converted[0] : converted;
          url = URL.createObjectURL(convertedBlob);
          isExternal = false;
        } catch (err) {
          console.error("HEIC image conversion failed:", err);
          url = createObjectUrl(ctx.file);
          isExternal = Boolean(ctx.file.url);
        } finally {
          ctx.setLoading(false);
        }
      } else {
        url = createObjectUrl(ctx.file);
      }
      const wrapper = document.createElement("div");
      wrapper.className = "ofv-image-viewer";
      const showInlineControls = !ctx.options.toolbar;
      const controls = document.createElement("div");
      controls.className = "ofv-image-controls";
      const stage = document.createElement("div");
      stage.className = "ofv-image-stage";
      const infoBar = createImageInfoBar(await sourceBytesPromise, ext, ctx.file.mimeType, ctx.file.name);
      infoBar.hidden = true;
      infoBar.setAttribute("aria-hidden", "true");
      infoBar.style.display = "none";
      const image = document.createElement("img");
      image.className = "ofv-media ofv-image-content";
      image.alt = ctx.file.name;
      image.draggable = false;
      image.style.objectFit = objectFit(ctx.options.fit);
      if (url) {
        image.src = url;
      }
      const visual = canvasSource || image;
      if (canvasSource) {
        canvasSource.classList.add("ofv-media", "ofv-image-content", "ofv-tiff-canvas");
        canvasSource.setAttribute("role", "img");
        canvasSource.setAttribute("aria-label", ctx.file.name);
      }
      let scale = getInitialZoom(ctx);
      let rotation = 0;
      let offsetX = 0;
      let offsetY = 0;
      let dragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let startOffsetX = 0;
      let startOffsetY = 0;
      let activePointerId = null;
      let previewAvailable = true;
      const zoomLabel = document.createElement("span");
      zoomLabel.className = "ofv-image-zoom";
      const updateTransform = () => {
        visual.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale}) rotate(${rotation}deg)`;
        zoomLabel.textContent = `${Math.round(scale * 100)}%`;
        ctx.toolbar?.setZoom(previewAvailable ? scale : void 0);
      };
      const showImageFallback = () => {
        previewAvailable = false;
        ctx.toolbar?.setZoom(void 0);
        infoBar.hidden = false;
        infoBar.removeAttribute("aria-hidden");
        infoBar.style.removeProperty("display");
        stage.replaceChildren(createImageFallback(ctx.file.name, url));
        ctx.toolbar?.refreshCommandSupport();
      };
      const setScale = (nextScale) => {
        scale = Math.min(8, Math.max(0.1, nextScale));
        updateTransform();
      };
      const reset = () => {
        scale = 1;
        rotation = 0;
        offsetX = 0;
        offsetY = 0;
        updateTransform();
      };
      const addButton = (label, title, action) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.title = title;
        button.setAttribute("aria-label", title);
        button.addEventListener("click", action);
        controls.append(button);
        return () => button.removeEventListener("click", action);
      };
      const disposers = showInlineControls ? [
        addButton("-", "Zoom out", () => setScale(scale - 0.25)),
        addButton("+", "Zoom in", () => setScale(scale + 0.25)),
        addButton("Rotate", "Rotate image", () => {
          rotation += 90;
          updateTransform();
        }),
        addButton("Reset", "Reset image view", reset)
      ] : [];
      if (showInlineControls) {
        controls.append(zoomLabel);
      }
      const onPointerDown = (event) => {
        if (event.button !== 0) {
          return;
        }
        if (activePointerId !== null && activePointerId !== event.pointerId) {
          finishDrag(activePointerId);
        }
        dragging = true;
        activePointerId = event.pointerId;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        startOffsetX = offsetX;
        startOffsetY = offsetY;
        stage.classList.add("is-dragging");
        try {
          stage.setPointerCapture(event.pointerId);
        } catch {
        }
      };
      const onPointerMove = (event) => {
        if (!dragging || event.pointerId !== activePointerId) {
          return;
        }
        offsetX = startOffsetX + event.clientX - dragStartX;
        offsetY = startOffsetY + event.clientY - dragStartY;
        updateTransform();
      };
      const finishDrag = (pointerId) => {
        const captureId = pointerId ?? activePointerId;
        dragging = false;
        activePointerId = null;
        stage.classList.remove("is-dragging");
        if (captureId !== null && captureId !== void 0) {
          try {
            if (stage.hasPointerCapture(captureId)) {
              stage.releasePointerCapture(captureId);
            }
          } catch {
          }
        }
      };
      const onPointerUp = (event) => {
        if (event.pointerId === activePointerId) {
          finishDrag(event.pointerId);
        }
      };
      const onLostPointerCapture = (event) => {
        if (event.pointerId === activePointerId) {
          finishDrag(null);
        }
      };
      const onPointerLeave = (event) => {
        if (event.pointerId === activePointerId && event.buttons === 0) {
          finishDrag(event.pointerId);
        }
      };
      const onWindowBlur = () => {
        finishDrag();
      };
      const onWheel = (event) => {
        if (!event.ctrlKey && !event.metaKey) {
          return;
        }
        event.preventDefault();
        setScale(scale + (event.deltaY > 0 ? -0.1 : 0.1));
      };
      stage.addEventListener("pointerdown", onPointerDown);
      stage.addEventListener("pointermove", onPointerMove);
      stage.addEventListener("pointerup", onPointerUp);
      stage.addEventListener("pointercancel", onPointerUp);
      stage.addEventListener("lostpointercapture", onLostPointerCapture);
      stage.addEventListener("pointerleave", onPointerLeave);
      stage.addEventListener("wheel", onWheel, { passive: false });
      if (!canvasSource) {
        image.addEventListener("error", showImageFallback);
      }
      window.addEventListener("blur", onWindowBlur);
      stage.append(visual);
      wrapper.append(...showInlineControls ? [controls, stage, infoBar] : [stage, infoBar]);
      ctx.viewport.append(wrapper);
      updateTransform();
      return {
        canCommand(command) {
          return previewAvailable && (command === "zoom-in" || command === "zoom-out" || command === "zoom-reset" || command === "rotate-right" || command === "rotate-left");
        },
        command(command) {
          if (!previewAvailable) {
            return false;
          }
          if (command === "zoom-in") {
            setScale(scale + 0.25);
            return true;
          }
          if (command === "zoom-out") {
            setScale(scale - 0.25);
            return true;
          }
          if (command === "zoom-reset") {
            reset();
            return true;
          }
          if (command === "rotate-right") {
            rotation += 90;
            updateTransform();
            return true;
          }
          if (command === "rotate-left") {
            rotation -= 90;
            updateTransform();
            return true;
          }
          return false;
        },
        resize(size) {
          visual.style.maxWidth = `${size.width}px`;
          visual.style.maxHeight = `${Math.max(0, size.height - controls.offsetHeight)}px`;
        },
        destroy() {
          ctx.toolbar?.setZoom(void 0);
          for (const dispose of disposers) {
            dispose();
          }
          stage.removeEventListener("pointerdown", onPointerDown);
          stage.removeEventListener("pointermove", onPointerMove);
          stage.removeEventListener("pointerup", onPointerUp);
          stage.removeEventListener("pointercancel", onPointerUp);
          stage.removeEventListener("lostpointercapture", onLostPointerCapture);
          stage.removeEventListener("pointerleave", onPointerLeave);
          stage.removeEventListener("wheel", onWheel);
          image.removeEventListener("error", showImageFallback);
          window.removeEventListener("blur", onWindowBlur);
          finishDrag();
          wrapper.remove();
          if (convertedBlob) {
            URL.revokeObjectURL(url);
          } else if (url) {
            revokeObjectUrl(url, isExternal);
          }
        }
      };
    }
  };
}
async function createTiffCanvas(bytes) {
  if (bytes.byteLength === 0) {
    throw new Error("\u65E0\u6CD5\u8BFB\u53D6 TIFF \u6587\u4EF6\u5185\u5BB9\u3002");
  }
  const UTIF = await import("utif");
  const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const ifds = UTIF.decode(buffer);
  const ifd = ifds.find((item) => Number(item.width || 0) > 0 || Number(item.t256 || 0) > 0) || ifds[0];
  if (!ifd) {
    throw new Error("TIFF \u6587\u4EF6\u6CA1\u6709\u53EF\u89E3\u7801\u7684\u56FE\u50CF\u76EE\u5F55\u3002");
  }
  UTIF.decodeImage(buffer, ifd);
  const rgba = UTIF.toRGBA8(ifd);
  const width = Number(ifd.width || ifd.t256 || 0);
  const height = Number(ifd.height || ifd.t257 || 0);
  if (!width || !height || rgba.length < width * height * 4) {
    throw new Error("TIFF \u56FE\u50CF\u50CF\u7D20\u6570\u636E\u4E0D\u5B8C\u6574\u3002");
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301 Canvas 2D\uFF0C\u65E0\u6CD5\u5C55\u793A TIFF\u3002");
  }
  context.putImageData(new ImageData(new Uint8ClampedArray(rgba), width, height), 0, 0);
  return canvas;
}
function createImageFallback(fileName, url) {
  const fallback = document.createElement("div");
  fallback.className = "ofv-fallback";
  const title = document.createElement("strong");
  title.textContent = "\u56FE\u7247\u9884\u89C8\u5931\u8D25";
  const meta = document.createElement("span");
  meta.textContent = "\u5F53\u524D\u6D4F\u89C8\u5668\u65E0\u6CD5\u76F4\u63A5\u663E\u793A\u8BE5\u56FE\u7247\uFF0C\u6587\u4EF6\u53EF\u80FD\u5DF2\u635F\u574F\u6216\u7F16\u7801\u6682\u4E0D\u53D7\u652F\u6301\u3002";
  const download = document.createElement("a");
  download.href = url;
  download.download = fileName;
  download.textContent = "\u4E0B\u8F7D\u56FE\u7247";
  fallback.append(title, meta, download);
  return fallback;
}
async function readImageBytes(file) {
  if (file.blob) {
    return new Uint8Array(await file.blob.arrayBuffer().catch(() => new ArrayBuffer(0)));
  }
  const url = file.url || (typeof file.source === "string" ? file.source : "");
  if (!url) {
    return new Uint8Array();
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return new Uint8Array();
    }
    return new Uint8Array(await response.arrayBuffer());
  } catch {
    return new Uint8Array();
  }
}
function createImageInfoBar(bytes, extension, mimeType, fileName) {
  const info = parseImageInfo(bytes, extension, mimeType, fileName);
  const bar = document.createElement("div");
  bar.className = "ofv-image-info";
  appendImageInfo(bar, "\u683C\u5F0F", info.format);
  if (info.width && info.height) {
    appendImageInfo(bar, "\u5C3A\u5BF8", `${info.width} x ${info.height}px`);
  }
  if (info.bitDepth) {
    appendImageInfo(bar, "\u4F4D\u6DF1", info.bitDepth);
  }
  if (info.color) {
    appendImageInfo(bar, "\u989C\u8272", info.color);
  }
  if (info.frames !== void 0) {
    appendImageInfo(bar, "\u5E27", String(info.frames));
  }
  if (info.count !== void 0) {
    appendImageInfo(bar, "\u56FE\u50CF", String(info.count));
  }
  if (info.note) {
    appendImageInfo(bar, "\u8BF4\u660E", info.note);
  }
  return bar;
}
function appendImageInfo(parent, label, value) {
  const row = document.createElement("span");
  row.className = "ofv-image-info-item";
  const key = document.createElement("span");
  key.textContent = label;
  const content = document.createElement("strong");
  content.textContent = value;
  row.append(key, content);
  parent.append(row);
}
function parseImageInfo(bytes, extension, mimeType, fileName) {
  const fallbackFormat = (extension || mimeType || fileName.split(".").pop() || "image").toUpperCase();
  if (bytes.length === 0) {
    return { format: fallbackFormat, note: "\u65E0\u6CD5\u8BFB\u53D6\u672C\u5730\u5934\u4FE1\u606F" };
  }
  return parsePngInfo(bytes) || parseJpegInfo(bytes) || parseGifInfo(bytes) || parseWebpInfo(bytes) || parseAvifInfo(bytes) || parseBmpInfo(bytes) || parseIcoInfo(bytes) || parseTiffInfo(bytes) || parseSvgInfo(bytes) || { format: fallbackFormat, note: "\u6682\u672A\u8BC6\u522B\u56FE\u7247\u5934\u7ED3\u6784" };
}
function parsePngInfo(bytes) {
  if (bytes.length < 33 || !bytesMatch(bytes, 0, [137, 80, 78, 71, 13, 10, 26, 10])) {
    return null;
  }
  const view3 = dataView(bytes);
  const frames = countPngChunks(bytes, "fcTL");
  return {
    format: frames > 0 ? "APNG" : "PNG",
    width: view3.getUint32(16, false),
    height: view3.getUint32(20, false),
    bitDepth: `${bytes[24]} bit`,
    color: pngColorType(bytes[25]),
    frames: frames > 0 ? frames : void 0
  };
}
function parseJpegInfo(bytes) {
  if (bytes.length < 4 || bytes[0] !== 255 || bytes[1] !== 216) {
    return null;
  }
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 255) {
      offset++;
      continue;
    }
    const marker = bytes[offset + 1];
    offset += 2;
    while (bytes[offset] === 255) {
      offset++;
    }
    if (marker === 217 || marker === 218) {
      break;
    }
    if (offset + 2 > bytes.length) {
      break;
    }
    const length = bytes[offset] << 8 | bytes[offset + 1];
    if (length < 2 || offset + length > bytes.length) {
      break;
    }
    if (marker >= 192 && marker <= 195 || marker >= 197 && marker <= 199 || marker >= 201 && marker <= 203 || marker >= 205 && marker <= 207) {
      return {
        format: "JPEG",
        width: bytes[offset + 5] << 8 | bytes[offset + 6],
        height: bytes[offset + 3] << 8 | bytes[offset + 4],
        bitDepth: `${bytes[offset + 2]} bit`,
        color: `${bytes[offset + 7]} component`
      };
    }
    offset += length;
  }
  return { format: "JPEG", note: "\u672A\u5728\u5934\u90E8\u626B\u63CF\u5230 SOF \u5C3A\u5BF8\u6BB5" };
}
function parseGifInfo(bytes) {
  const header = asciiAt(bytes, 0, 6);
  if (header !== "GIF87a" && header !== "GIF89a") {
    return null;
  }
  const packed = bytes[10] || 0;
  return {
    format: header,
    width: readUint16Le(bytes, 6),
    height: readUint16Le(bytes, 8),
    bitDepth: `${(packed & 7) + 1} bit`,
    color: packed & 128 ? "Global color table" : "No global color table",
    frames: countGifFrames(bytes)
  };
}
function parseWebpInfo(bytes) {
  if (bytes.length < 16 || asciiAt(bytes, 0, 4) !== "RIFF" || asciiAt(bytes, 8, 4) !== "WEBP") {
    return null;
  }
  const chunk = asciiAt(bytes, 12, 4);
  if (chunk === "VP8X" && bytes.length >= 30) {
    const flags = bytes[20];
    return {
      format: "WebP",
      width: 1 + readUint24Le(bytes, 24),
      height: 1 + readUint24Le(bytes, 27),
      frames: (flags & 2) !== 0 ? countWebpAnimationFrames(bytes) : void 0,
      color: (flags & 16) !== 0 ? "Alpha" : void 0
    };
  }
  if (chunk === "VP8 " && bytes.length >= 30) {
    const start = 20;
    if (bytes[start + 3] === 157 && bytes[start + 4] === 1 && bytes[start + 5] === 42) {
      return {
        format: "WebP",
        width: readUint16Le(bytes, start + 6) & 16383,
        height: readUint16Le(bytes, start + 8) & 16383
      };
    }
  }
  if (chunk === "VP8L" && bytes.length >= 25) {
    const b0 = bytes[21];
    const b1 = bytes[22];
    const b2 = bytes[23];
    const b3 = bytes[24];
    return {
      format: "WebP",
      width: 1 + ((b1 & 63) << 8 | b0),
      height: 1 + ((b3 & 15) << 10 | b2 << 2 | (b1 & 192) >> 6),
      color: "Lossless"
    };
  }
  return { format: "WebP", note: `\u672A\u77E5 ${chunk || "chunk"} \u5934` };
}
function parseAvifInfo(bytes) {
  const boxes = collectBmffBoxes(bytes, 0, bytes.length);
  const ftyp = boxes.find((box) => box.type === "ftyp");
  if (!ftyp) {
    return null;
  }
  const majorBrand = asciiAt(bytes, ftyp.dataStart, 4);
  const compatibleBrands = asciiAt(bytes, ftyp.dataStart + 8, Math.max(0, ftyp.dataEnd - ftyp.dataStart - 8));
  if (!/\b(avif|avis|mif1|msf1|heic|heix|hevc|hevx)\b/.test(`${majorBrand} ${compatibleBrands}`)) {
    return null;
  }
  const ispe = findBmffBox(bytes, boxes, "ispe");
  return {
    format: majorBrand === "avis" || compatibleBrands.includes("avis") ? "AVIF Sequence" : majorBrand.startsWith("hei") ? "HEIF" : "AVIF",
    width: ispe && ispe.dataStart + 12 <= ispe.dataEnd ? readUint32Be(bytes, ispe.dataStart + 4) : void 0,
    height: ispe && ispe.dataStart + 12 <= ispe.dataEnd ? readUint32Be(bytes, ispe.dataStart + 8) : void 0,
    note: `brand ${majorBrand}${compatibleBrands.trim() ? ` \xB7 ${formatBmffBrands(compatibleBrands)}` : ""}`
  };
}
function collectBmffBoxes(bytes, start, end) {
  const boxes = [];
  let offset = start;
  while (offset + 8 <= end && boxes.length < 512) {
    let size = readUint32Be(bytes, offset);
    const type = asciiAt(bytes, offset + 4, 4);
    let headerSize = 8;
    if (!/^[A-Za-z0-9 _-]{4}$/.test(type)) {
      break;
    }
    if (size === 1 && offset + 16 <= end) {
      const high = readUint32Be(bytes, offset + 8);
      const low = readUint32Be(bytes, offset + 12);
      size = high > 0 ? end - offset : low;
      headerSize = 16;
    } else if (size === 0) {
      size = end - offset;
    }
    if (size < headerSize || offset + size > end) {
      break;
    }
    boxes.push({
      type,
      start: offset,
      dataStart: offset + headerSize,
      dataEnd: offset + size,
      end: offset + size
    });
    offset += size;
  }
  return boxes;
}
function findBmffBox(bytes, boxes, type) {
  for (const box of boxes) {
    if (box.type === type) {
      return box;
    }
    if (["meta", "iprp", "ipco", "moov", "trak", "mdia", "minf", "stbl"].includes(box.type)) {
      const childStart = box.type === "meta" ? box.dataStart + 4 : box.dataStart;
      const found = findBmffBox(bytes, collectBmffBoxes(bytes, childStart, box.dataEnd), type);
      if (found) {
        return found;
      }
    }
  }
  return void 0;
}
function formatBmffBrands(value) {
  const brands = value.match(/.{1,4}/g)?.map((brand) => brand.trim()).filter(Boolean) || [];
  return brands.slice(0, 6).join(", ");
}
function parseBmpInfo(bytes) {
  if (bytes.length < 30 || asciiAt(bytes, 0, 2) !== "BM") {
    return null;
  }
  const dibSize = readUint32Le(bytes, 14);
  if (dibSize < 12) {
    return { format: "BMP", note: "DIB header \u592A\u77ED" };
  }
  if (dibSize === 12 && bytes.length >= 26) {
    return {
      format: "BMP",
      width: readUint16Le(bytes, 18),
      height: readUint16Le(bytes, 20),
      bitDepth: `${readUint16Le(bytes, 24)} bit`
    };
  }
  return {
    format: "BMP",
    width: readInt32Le(bytes, 18),
    height: Math.abs(readInt32Le(bytes, 22)),
    bitDepth: `${readUint16Le(bytes, 28)} bit`
  };
}
function parseIcoInfo(bytes) {
  if (bytes.length < 6 || readUint16Le(bytes, 0) !== 0 || ![1, 2].includes(readUint16Le(bytes, 2))) {
    return null;
  }
  const count = readUint16Le(bytes, 4);
  if (count < 1 || bytes.length < 6 + count * 16) {
    return { format: "ICO/CUR", count };
  }
  const width = bytes[6] || 256;
  const height = bytes[7] || 256;
  return {
    format: readUint16Le(bytes, 2) === 1 ? "ICO" : "CUR",
    width,
    height,
    bitDepth: `${readUint16Le(bytes, 12)} bit`,
    count
  };
}
function parseSvgInfo(bytes) {
  const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(0, Math.min(bytes.length, 8192)));
  if (!/<svg[\s>]/i.test(text)) {
    return null;
  }
  const tag = text.match(/<svg\b[^>]*>/i)?.[0] || "";
  const width = numberAttribute(tag, "width");
  const height = numberAttribute(tag, "height");
  const viewBox = tag.match(/\bviewBox=["']([^"']+)["']/i)?.[1]?.trim();
  const viewBoxParts = viewBox?.split(/[\s,]+/).map(Number).filter(Number.isFinite);
  return {
    format: "SVG",
    width: width || (viewBoxParts?.length === 4 ? viewBoxParts[2] : void 0),
    height: height || (viewBoxParts?.length === 4 ? viewBoxParts[3] : void 0),
    note: viewBox ? `viewBox ${viewBox}` : void 0
  };
}
function parseTiffInfo(bytes) {
  if (bytes.length < 8) {
    return null;
  }
  const littleEndian = asciiAt(bytes, 0, 2) === "II";
  const bigEndian = asciiAt(bytes, 0, 2) === "MM";
  if (!littleEndian && !bigEndian) {
    return null;
  }
  const magic = readTiffUint16(bytes, 2, littleEndian);
  if (magic !== 42 && magic !== 43) {
    return null;
  }
  const ifdOffset = magic === 43 ? readTiffUint64AsNumber(bytes, 8, littleEndian) : readTiffUint32(bytes, 4, littleEndian);
  if (!Number.isFinite(ifdOffset) || ifdOffset + 2 > bytes.length) {
    return { format: magic === 43 ? "BigTIFF" : "TIFF", note: "IFD \u504F\u79FB\u8D85\u51FA\u6587\u4EF6\u8303\u56F4" };
  }
  const count = magic === 43 ? readTiffUint64AsNumber(bytes, ifdOffset, littleEndian) : readTiffUint16(bytes, ifdOffset, littleEndian);
  const entrySize = magic === 43 ? 20 : 12;
  const entriesStart = ifdOffset + (magic === 43 ? 8 : 2);
  let width;
  let height;
  let bitDepth;
  let compression;
  for (let index = 0; index < Math.min(count, 256); index++) {
    const offset = entriesStart + index * entrySize;
    if (offset + entrySize > bytes.length) {
      break;
    }
    const tag = readTiffUint16(bytes, offset, littleEndian);
    const type = readTiffUint16(bytes, offset + 2, littleEndian);
    const valueOffset = magic === 43 ? offset + 12 : offset + 8;
    const value = readTiffInlineValue(bytes, valueOffset, type, littleEndian);
    if (tag === 256) width = value;
    if (tag === 257) height = value;
    if (tag === 258) bitDepth = value;
    if (tag === 259) compression = value;
  }
  return {
    format: magic === 43 ? "BigTIFF" : "TIFF",
    width,
    height,
    bitDepth: bitDepth ? `${bitDepth} bit` : void 0,
    color: compression ? tiffCompressionName(compression) : void 0,
    count: Number.isFinite(count) ? count : void 0
  };
}
function readTiffInlineValue(bytes, offset, type, littleEndian) {
  if (offset + 4 > bytes.length) {
    return void 0;
  }
  if (type === 3) {
    return readTiffUint16(bytes, offset, littleEndian);
  }
  if (type === 4 || type === 13) {
    return readTiffUint32(bytes, offset, littleEndian);
  }
  return readTiffUint16(bytes, offset, littleEndian);
}
function tiffCompressionName(value) {
  const names = {
    1: "Uncompressed",
    3: "CCITT Group 3",
    4: "CCITT Group 4",
    5: "LZW",
    6: "Old JPEG",
    7: "JPEG",
    8: "Deflate",
    32773: "PackBits"
  };
  return names[value] || `Compression ${value}`;
}
function countPngChunks(bytes, chunkType) {
  let offset = 8;
  let count = 0;
  while (offset + 12 <= bytes.length) {
    const length = readUint32Be(bytes, offset);
    const type = asciiAt(bytes, offset + 4, 4);
    if (type === chunkType) {
      count++;
    }
    offset += 12 + length;
  }
  return count;
}
function countGifFrames(bytes) {
  let count = 0;
  for (let index = 13; index < bytes.length; index++) {
    if (bytes[index] === 44) {
      count++;
    }
  }
  return count || 1;
}
function countWebpAnimationFrames(bytes) {
  let count = 0;
  for (let offset = 12; offset + 8 <= bytes.length; ) {
    const type = asciiAt(bytes, offset, 4);
    const size = readUint32Le(bytes, offset + 4);
    if (type === "ANMF") {
      count++;
    }
    offset += 8 + size + size % 2;
  }
  return count || 1;
}
function pngColorType(value) {
  const colors = {
    0: "Grayscale",
    2: "Truecolor",
    3: "Indexed color",
    4: "Grayscale + alpha",
    6: "Truecolor + alpha"
  };
  return colors[value] || `Unknown (${value})`;
}
function numberAttribute(tag, name) {
  const value = tag.match(new RegExp(`\\b${name}=["']([0-9.]+)`, "i"))?.[1];
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function bytesMatch(bytes, offset, expected) {
  return expected.every((byte, index) => bytes[offset + index] === byte);
}
function dataView(bytes) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}
function asciiAt(bytes, offset, length) {
  if (offset < 0 || offset + length > bytes.length) {
    return "";
  }
  return new TextDecoder("ascii").decode(bytes.slice(offset, offset + length));
}
function readUint16Le(bytes, offset) {
  return dataView(bytes).getUint16(offset, true);
}
function readUint24Le(bytes, offset) {
  return bytes[offset] | bytes[offset + 1] << 8 | bytes[offset + 2] << 16;
}
function readUint32Le(bytes, offset) {
  return dataView(bytes).getUint32(offset, true);
}
function readUint32Be(bytes, offset) {
  return dataView(bytes).getUint32(offset, false);
}
function readInt32Le(bytes, offset) {
  return dataView(bytes).getInt32(offset, true);
}
function readTiffUint16(bytes, offset, littleEndian) {
  return dataView(bytes).getUint16(offset, littleEndian);
}
function readTiffUint32(bytes, offset, littleEndian) {
  return dataView(bytes).getUint32(offset, littleEndian);
}
function readTiffUint64AsNumber(bytes, offset, littleEndian) {
  if (offset + 8 > bytes.length) {
    return Number.NaN;
  }
  const view3 = dataView(bytes);
  const low = view3.getUint32(offset + (littleEndian ? 0 : 4), littleEndian);
  const high = view3.getUint32(offset + (littleEndian ? 4 : 0), littleEndian);
  return high * 2 ** 32 + low;
}
function objectFit(fit) {
  if (fit === "cover") {
    return "cover";
  }
  if (fit === "actual") {
    return "none";
  }
  if (fit === "scale-down") {
    return "scale-down";
  }
  return "contain";
}

// src/plugins/video.ts
var mpegtsPackageName = "mpegts.js";
var loadMpegts = () => importOptionalModule(mpegtsPackageName);
var videoExtensions = /* @__PURE__ */ new Set([
  "mp4",
  "mpg",
  "mpeg",
  "mpe",
  "mpv",
  "webm",
  "ogv",
  "mov",
  "m4v",
  "avi",
  "mkv",
  "flv",
  "wmv",
  "3gp",
  "3g2",
  "m2ts",
  "m3u8"
]);
var videoMimeTypes = /* @__PURE__ */ new Set([
  "application/vnd.apple.mpegurl",
  "application/x-mpegurl",
  "application/mpegurl",
  "application/dash+xml"
]);
var hlsMimeTypes = /* @__PURE__ */ new Set(["application/vnd.apple.mpegurl", "application/x-mpegurl", "application/mpegurl"]);
function videoPlugin() {
  return {
    name: "video",
    match(file) {
      return file.mimeType.startsWith("video/") || videoMimeTypes.has(file.mimeType) || videoExtensions.has(file.extension);
    },
    async render(ctx) {
      const url = createObjectUrl(ctx.file);
      const isExternal = Boolean(ctx.file.url);
      const mimeType = ctx.file.mimeType.toLowerCase();
      const bytes = await readVideoBytes(ctx.file.blob);
      const container = document.createElement("div");
      container.className = "ofv-video-container";
      const stage = document.createElement("div");
      stage.className = "ofv-video-stage";
      const video = document.createElement("video");
      video.className = "ofv-media";
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.style.objectFit = ctx.options.fit === "cover" ? "cover" : "contain";
      const ext = ctx.file.extension.toLowerCase();
      const infoBar = createVideoInfo(parseVideoInfo(bytes, ext, mimeType, ctx.file.name));
      infoBar.hidden = true;
      infoBar.setAttribute("aria-hidden", "true");
      infoBar.style.display = "none";
      stage.append(video);
      container.append(stage, infoBar);
      ctx.viewport.classList.add("ofv-center");
      ctx.viewport.append(container);
      let hlsInstance = null;
      let mpegtsPlayer = null;
      const isHls = ext === "m3u8" || hlsMimeTypes.has(mimeType);
      const isMpegTs = ext === "m2ts" || mimeType === "video/mp2t";
      const isDash = mimeType === "application/dash+xml";
      const isFlv = ext === "flv" || mimeType === "video/x-flv";
      const formatLabel = (ctx.file.extension || ctx.file.mimeType || "video").toUpperCase();
      const controller = createVideoTransformController(video, ctx);
      const showTranscodeFallback = () => {
        video.pause();
        video.remove();
        controller.setAvailable(false);
        ctx.toolbar?.refreshCommandSupport();
        infoBar.hidden = false;
        infoBar.removeAttribute("aria-hidden");
        infoBar.style.removeProperty("display");
        const oldFallback = stage.querySelector(".ofv-fallback");
        if (oldFallback) {
          oldFallback.remove();
        }
        const fallback = document.createElement("div");
        fallback.className = "ofv-fallback";
        const title = document.createElement("strong");
        title.textContent = `\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u76F4\u63A5\u64AD\u653E\u8BE5\u89C6\u9891\u683C\u5F0F (${formatLabel})`;
        const meta = document.createElement("span");
        meta.textContent = "\u5EFA\u8BAE\u8F6C\u6362\u4E3A MP4 \u683C\u5F0F\u64AD\u653E\uFF0C\u6216\u76F4\u63A5\u4E0B\u8F7D\u5728\u672C\u5730\u64AD\u653E\u3002";
        const download = document.createElement("a");
        download.href = url;
        download.download = ctx.file.name;
        download.textContent = "\u4E0B\u8F7D\u89C6\u9891";
        fallback.append(title, meta, download);
        stage.append(fallback);
      };
      const onVideoError = () => {
        showTranscodeFallback();
      };
      video.addEventListener("error", onVideoError);
      ctx.toolbar?.refreshCommandSupport();
      try {
        if (isDash) {
          showTranscodeFallback();
        } else if (isHls) {
          const Hls = (await import("hls.js")).default;
          if (Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(url);
            hlsInstance.attachMedia(video);
            hlsInstance.on(Hls.Events.ERROR, (_event, data) => {
              if (data.fatal) {
                showTranscodeFallback();
              }
            });
          } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
          } else {
            showTranscodeFallback();
          }
        } else if (isFlv || isMpegTs) {
          const mpegtsModule = await loadMpegts();
          const mpegts = resolveMpegtsApi(mpegtsModule);
          if (mpegts.isSupported()) {
            mpegtsPlayer = mpegts.createPlayer({
              type: isFlv ? "flv" : "mpegts",
              url
            });
            mpegtsPlayer.attachMediaElement(video);
            mpegtsPlayer.load();
            mpegtsPlayer.on(mpegts.Events.ERROR, () => {
              showTranscodeFallback();
            });
          } else {
            showTranscodeFallback();
          }
        } else {
          video.src = url;
        }
      } catch (err) {
        showTranscodeFallback();
      }
      return {
        canCommand(command) {
          return controller.canCommand(command);
        },
        command(command) {
          return controller.command(command);
        },
        resize() {
          video.style.width = "100%";
          video.style.height = "100%";
        },
        destroy() {
          video.removeEventListener("error", onVideoError);
          if (video.isConnected) {
            video.pause();
          }
          controller.destroy();
          if (hlsInstance) {
            hlsInstance.destroy();
          }
          if (mpegtsPlayer) {
            mpegtsPlayer.unload();
            mpegtsPlayer.destroy();
          }
          ctx.viewport.classList.remove("ofv-center");
          revokeObjectUrl(url, isExternal);
          container.remove();
        }
      };
    }
  };
}
function importOptionalModule(packageName) {
  return new Function("packageName", "return import(packageName)")(packageName);
}
function resolveMpegtsApi(module) {
  const api = module.default || module;
  if (!api.Events || !api.isSupported || !api.createPlayer) {
    throw new Error("mpegts.js is not available.");
  }
  return api;
}
function createVideoTransformController(video, ctx) {
  let scale = 1;
  let rotation = 0;
  let available = true;
  const apply = () => {
    video.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    video.style.transformOrigin = "center";
    ctx.toolbar?.setZoom(available ? scale : void 0);
  };
  apply();
  const canTransform = (command) => available && (command === "zoom-in" || command === "zoom-out" || command === "zoom-reset" || command === "rotate-right" || command === "rotate-left");
  return {
    setAvailable(nextAvailable) {
      available = nextAvailable;
      if (available) {
        apply();
      } else {
        ctx.toolbar?.setZoom(void 0);
      }
    },
    canCommand(command) {
      return canTransform(command);
    },
    command(command) {
      if (!canTransform(command)) {
        return false;
      }
      if (command === "zoom-in") {
        scale = Math.min(4, Number((scale + 0.25).toFixed(2)));
        apply();
        return true;
      }
      if (command === "zoom-out") {
        scale = Math.max(0.25, Number((scale - 0.25).toFixed(2)));
        apply();
        return true;
      }
      if (command === "zoom-reset") {
        scale = 1;
        rotation = 0;
        apply();
        return true;
      }
      if (command === "rotate-right") {
        rotation += 90;
        apply();
        return true;
      }
      if (command === "rotate-left") {
        rotation -= 90;
        apply();
        return true;
      }
      return false;
    },
    destroy() {
      ctx.toolbar?.setZoom(void 0);
    }
  };
}
async function readVideoBytes(blob) {
  if (!blob) {
    return new Uint8Array();
  }
  return new Uint8Array(await blob.arrayBuffer().catch(() => new ArrayBuffer(0)));
}
function createVideoInfo(info) {
  const bar = document.createElement("div");
  bar.className = "ofv-media-info";
  appendMediaInfo(bar, "\u683C\u5F0F", info.format);
  if (info.codec) {
    appendMediaInfo(bar, "\u7F16\u7801", info.codec);
  }
  if (info.width && info.height) {
    appendMediaInfo(bar, "\u5C3A\u5BF8", `${info.width} x ${info.height}px`);
  }
  if (info.duration) {
    appendMediaInfo(bar, "\u65F6\u957F", info.duration);
  }
  if (info.bitrate) {
    appendMediaInfo(bar, "\u7801\u7387", info.bitrate);
  }
  if (info.tracks !== void 0) {
    appendMediaInfo(bar, "\u8F68\u9053", String(info.tracks));
  }
  if (info.variants !== void 0) {
    appendMediaInfo(bar, "\u53D8\u4F53", String(info.variants));
  }
  if (info.segments !== void 0) {
    appendMediaInfo(bar, "\u7247\u6BB5", String(info.segments));
  }
  if (info.note) {
    appendMediaInfo(bar, "\u8BF4\u660E", info.note);
  }
  return bar;
}
function appendMediaInfo(parent, label, value) {
  const item = document.createElement("span");
  item.className = "ofv-media-info-item";
  const key = document.createElement("span");
  key.textContent = label;
  const content = document.createElement("strong");
  content.textContent = value;
  item.append(key, content);
  parent.append(item);
}
function parseVideoInfo(bytes, extension, mimeType, fileName) {
  const fallback = (extension || mimeType || fileName.split(".").pop() || "video").toUpperCase();
  if (bytes.length === 0) {
    return { format: fallback, note: "\u65E0\u6CD5\u8BFB\u53D6\u672C\u5730\u5934\u4FE1\u606F" };
  }
  return parseHlsInfo(bytes) || parseDashInfo(bytes) || parseMp4Info(bytes) || parseAviInfo(bytes) || parseEbmlInfo(bytes) || {
    format: fallback,
    note: "\u6682\u672A\u8BC6\u522B\u89C6\u9891\u5934\u7ED3\u6784"
  };
}
function parseMp4Info(bytes) {
  if (bytes.length < 12 || asciiAt2(bytes, 4, 4) !== "ftyp") {
    return null;
  }
  const majorBrand = asciiAt2(bytes, 8, 4);
  const info = { format: ["qt  "].includes(majorBrand) ? "MOV" : "MP4", codec: majorBrand };
  const atoms = collectMp4Atoms(bytes, 0, bytes.length);
  const moov = atoms.find((atom) => atom.type === "moov");
  if (moov) {
    const children = collectMp4Atoms(bytes, moov.start + moov.headerSize, moov.end);
    const mvhd = children.find((atom) => atom.type === "mvhd");
    if (mvhd) {
      const duration = readMp4MvhdDuration(bytes, mvhd.start + mvhd.headerSize);
      if (duration !== void 0) {
        info.duration = formatDuration(duration);
      }
    }
    const tracks = children.filter((atom) => atom.type === "trak");
    info.tracks = tracks.length;
    for (const track of tracks) {
      const tkhd = collectMp4Atoms(bytes, track.start + track.headerSize, track.end).find((atom) => atom.type === "tkhd");
      if (tkhd) {
        const size = readMp4TkhdSize(bytes, tkhd.start + tkhd.headerSize);
        if (size.width && size.height) {
          info.width = size.width;
          info.height = size.height;
          break;
        }
      }
    }
  }
  return info;
}
function collectMp4Atoms(bytes, start, end) {
  const atoms = [];
  let offset = start;
  while (offset + 8 <= end) {
    let size = readUint32Be2(bytes, offset);
    const type = asciiAt2(bytes, offset + 4, 4);
    let headerSize = 8;
    if (size === 1 && offset + 16 <= end) {
      size = Number(readUint64Be(bytes, offset + 8));
      headerSize = 16;
    }
    if (size < headerSize || offset + size > end || !/^[\w ]{4}$/.test(type)) {
      break;
    }
    atoms.push({ type, start: offset, end: offset + size, headerSize });
    offset += size;
  }
  return atoms;
}
function readMp4MvhdDuration(bytes, offset) {
  if (offset + 20 > bytes.length) {
    return void 0;
  }
  const version = bytes[offset];
  if (version === 1 && offset + 32 <= bytes.length) {
    const timescale2 = readUint32Be2(bytes, offset + 20);
    const duration2 = readUint64Be(bytes, offset + 24);
    return timescale2 ? Number(duration2) / timescale2 : void 0;
  }
  const timescale = readUint32Be2(bytes, offset + 12);
  const duration = readUint32Be2(bytes, offset + 16);
  return timescale ? duration / timescale : void 0;
}
function readMp4TkhdSize(bytes, offset) {
  const version = bytes[offset];
  const sizeOffset = version === 1 ? offset + 84 : offset + 72;
  if (sizeOffset + 8 > bytes.length) {
    return {};
  }
  return {
    width: readUint32Be2(bytes, sizeOffset) / 65536,
    height: readUint32Be2(bytes, sizeOffset + 4) / 65536
  };
}
function parseAviInfo(bytes) {
  if (bytes.length < 64 || asciiAt2(bytes, 0, 4) !== "RIFF" || asciiAt2(bytes, 8, 4) !== "AVI ") {
    return null;
  }
  const avihOffset = findAscii(bytes, "avih", 12);
  if (avihOffset < 0 || avihOffset + 56 > bytes.length) {
    return { format: "AVI", note: "\u672A\u627E\u5230 avih header" };
  }
  const microSecPerFrame = readUint32Le2(bytes, avihOffset + 8);
  const maxBytesPerSec = readUint32Le2(bytes, avihOffset + 16);
  const totalFrames = readUint32Le2(bytes, avihOffset + 24);
  const streams = readUint32Le2(bytes, avihOffset + 32);
  const width = readUint32Le2(bytes, avihOffset + 40);
  const height = readUint32Le2(bytes, avihOffset + 44);
  return {
    format: "AVI",
    width,
    height,
    tracks: streams,
    bitrate: maxBytesPerSec ? `${Math.round(maxBytesPerSec * 8 / 1e3)} kbps` : void 0,
    duration: microSecPerFrame && totalFrames ? formatDuration(microSecPerFrame * totalFrames / 1e6) : void 0
  };
}
function parseEbmlInfo(bytes) {
  if (bytes.length < 8 || bytes[0] !== 26 || bytes[1] !== 69 || bytes[2] !== 223 || bytes[3] !== 163) {
    return null;
  }
  const root = collectEbmlElements(bytes, 0, bytes.length);
  const header = root.find((element) => element.id === 440786851);
  const headerChildren = header ? collectEbmlElements(bytes, header.dataStart, header.dataEnd) : [];
  const docTypeValue = readEbmlString(bytes, headerChildren.find((element) => element.id === 17026));
  const segment = root.find((element) => element.id === 408125543);
  const segmentChildren = segment ? collectEbmlElements(bytes, segment.dataStart, segment.dataEnd) : [];
  const info = parseEbmlSegmentInfo(bytes, segmentChildren.find((element) => element.id === 357149030));
  const tracks = parseEbmlTracks(bytes, segmentChildren.find((element) => element.id === 374648427));
  const docType = docTypeValue?.toLowerCase().includes("webm") ? "WebM" : docTypeValue?.toLowerCase().includes("matroska") ? "Matroska" : "EBML";
  return {
    format: docType,
    codec: tracks.codecs.length > 0 ? tracks.codecs.slice(0, 4).join(", ") : void 0,
    width: tracks.width,
    height: tracks.height,
    duration: info.duration === void 0 ? void 0 : formatDuration(info.duration),
    tracks: tracks.count || void 0,
    note: docTypeValue ? `EBML DocType ${docTypeValue}` : "\u5DF2\u8BC6\u522B EBML \u5BB9\u5668"
  };
}
function collectEbmlElements(bytes, start, end, limit = 256) {
  const elements = [];
  let offset = start;
  while (offset < end && elements.length < limit) {
    const id = readEbmlId(bytes, offset, end);
    if (!id) {
      break;
    }
    const size = readEbmlSize(bytes, id.offset, end);
    if (!size) {
      break;
    }
    const dataStart = size.offset;
    const dataEnd = size.unknown ? end : dataStart + size.value;
    if (dataEnd < dataStart || dataEnd > end) {
      break;
    }
    elements.push({
      id: id.value,
      start: offset,
      dataStart,
      dataEnd,
      end: dataEnd
    });
    offset = dataEnd;
  }
  return elements;
}
function readEbmlId(bytes, offset, end) {
  const length = ebmlVintLength(bytes[offset]);
  if (!length || length > 4 || offset + length > end) {
    return void 0;
  }
  let value = 0;
  for (let index = 0; index < length; index++) {
    value = value * 256 + bytes[offset + index];
  }
  return { value, offset: offset + length };
}
function readEbmlSize(bytes, offset, end) {
  const length = ebmlVintLength(bytes[offset]);
  if (!length || length > 8 || offset + length > end) {
    return void 0;
  }
  const firstMask = 255 >> length;
  let value = bytes[offset] & firstMask;
  let max = firstMask;
  for (let index = 1; index < length; index++) {
    value = value * 256 + bytes[offset + index];
    max = max * 256 + 255;
  }
  return { value, offset: offset + length, unknown: value === max };
}
function ebmlVintLength(firstByte) {
  if (!firstByte) {
    return 0;
  }
  for (let length = 1; length <= 8; length++) {
    if (firstByte & 128 >> length - 1) {
      return length;
    }
  }
  return 0;
}
function parseEbmlSegmentInfo(bytes, element) {
  if (!element) {
    return {};
  }
  const children = collectEbmlElements(bytes, element.dataStart, element.dataEnd);
  const timecodeScale = readEbmlUInt(bytes, children.find((child) => child.id === 2807729)) || 1e6;
  const duration = readEbmlFloat(bytes, children.find((child) => child.id === 17545));
  return {
    duration: duration === void 0 ? void 0 : duration * timecodeScale / 1e9
  };
}
function parseEbmlTracks(bytes, element) {
  if (!element) {
    return { count: 0, codecs: [] };
  }
  const trackEntries = collectEbmlElements(bytes, element.dataStart, element.dataEnd).filter((child) => child.id === 174);
  const codecs = [];
  let width;
  let height;
  for (const track of trackEntries) {
    const children = collectEbmlElements(bytes, track.dataStart, track.dataEnd);
    const codec = readEbmlString(bytes, children.find((child) => child.id === 134));
    if (codec && !codecs.includes(codec)) {
      codecs.push(codec);
    }
    const type = readEbmlUInt(bytes, children.find((child) => child.id === 131));
    const video = children.find((child) => child.id === 224);
    if (type === 1 && video) {
      const videoChildren = collectEbmlElements(bytes, video.dataStart, video.dataEnd);
      width = readEbmlUInt(bytes, videoChildren.find((child) => child.id === 176)) || width;
      height = readEbmlUInt(bytes, videoChildren.find((child) => child.id === 186)) || height;
    }
  }
  return { count: trackEntries.length, codecs, width, height };
}
function readEbmlString(bytes, element) {
  if (!element || element.dataEnd <= element.dataStart || element.dataEnd - element.dataStart > 4096) {
    return void 0;
  }
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(element.dataStart, element.dataEnd)).replace(/\0+$/g, "").trim();
}
function readEbmlUInt(bytes, element) {
  if (!element || element.dataEnd <= element.dataStart || element.dataEnd - element.dataStart > 6) {
    return void 0;
  }
  let value = 0;
  for (let offset = element.dataStart; offset < element.dataEnd; offset++) {
    value = value * 256 + bytes[offset];
  }
  return value;
}
function readEbmlFloat(bytes, element) {
  if (!element) {
    return void 0;
  }
  const data = view(bytes);
  if (element.dataEnd - element.dataStart === 4) {
    return data.getFloat32(element.dataStart, false);
  }
  if (element.dataEnd - element.dataStart === 8) {
    return data.getFloat64(element.dataStart, false);
  }
  return void 0;
}
function parseHlsInfo(bytes) {
  const text = decodeTextHead(bytes);
  if (!text.startsWith("#EXTM3U")) {
    return null;
  }
  const segments = countMatches(text, /^#EXTINF:/gm);
  const variants = countMatches(text, /^#EXT-X-STREAM-INF:/gm);
  const durations = [...text.matchAll(/^#EXTINF:([0-9.]+)/gm)].map((match) => Number(match[1])).filter(Number.isFinite);
  const bandwidth = text.match(/BANDWIDTH=(\d+)/i)?.[1];
  return {
    format: "HLS",
    variants,
    segments,
    duration: durations.length > 0 ? formatDuration(durations.reduce((sum, value) => sum + value, 0)) : void 0,
    bitrate: bandwidth ? `${Math.round(Number(bandwidth) / 1e3)} kbps` : void 0
  };
}
function parseDashInfo(bytes) {
  const text = decodeTextHead(bytes);
  if (!/<MPD[\s>]/i.test(text)) {
    return null;
  }
  return {
    format: "DASH",
    duration: isoDurationToClock(text.match(/mediaPresentationDuration=["']([^"']+)["']/i)?.[1]),
    variants: countMatches(text, /<Representation\b/gi),
    segments: countMatches(text, /<SegmentURL\b|<S\b/gi)
  };
}
function decodeTextHead(bytes) {
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(0, Math.min(bytes.length, 65536))).trim();
}
function countMatches(value, pattern) {
  return [...value.matchAll(pattern)].length;
}
function isoDurationToClock(value) {
  if (!value) {
    return void 0;
  }
  const match = value.match(/^PT(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?$/i);
  if (!match) {
    return value;
  }
  const seconds = Number(match[1] || 0) * 3600 + Number(match[2] || 0) * 60 + Number(match[3] || 0);
  return formatDuration(seconds);
}
function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "";
  }
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor(total % 3600 / 60);
  const rest = total % 60;
  return hours > 0 ? `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}` : `${minutes}:${String(rest).padStart(2, "0")}`;
}
function asciiAt2(bytes, offset, length) {
  if (offset < 0 || offset + length > bytes.length) {
    return "";
  }
  return new TextDecoder("latin1").decode(bytes.slice(offset, offset + length));
}
function findAscii(bytes, value, start = 0) {
  const encoded = new TextEncoder().encode(value);
  for (let offset = start; offset + encoded.length <= bytes.length; offset++) {
    if (encoded.every((byte, index) => bytes[offset + index] === byte)) {
      return offset;
    }
  }
  return -1;
}
function view(bytes) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}
function readUint32Le2(bytes, offset) {
  return view(bytes).getUint32(offset, true);
}
function readUint32Be2(bytes, offset) {
  return view(bytes).getUint32(offset, false);
}
function readUint64Be(bytes, offset) {
  return BigInt(readUint32Be2(bytes, offset)) << 32n | BigInt(readUint32Be2(bytes, offset + 4));
}

// src/plugins/audio.ts
var audioExtensions = /* @__PURE__ */ new Set([
  "mp3",
  "wav",
  "aif",
  "aiff",
  "aifc",
  "ogg",
  "oga",
  "aac",
  "m4a",
  "flac",
  "opus",
  "weba",
  "amr",
  "mid",
  "midi",
  "caf",
  "au",
  "snd",
  "wma"
]);
function audioPlugin() {
  return {
    name: "audio",
    match(file) {
      return file.mimeType.startsWith("audio/") || audioExtensions.has(file.extension);
    },
    async render(ctx) {
      const url = createObjectUrl(ctx.file);
      const isExternal = Boolean(ctx.file.url);
      const wrapper = document.createElement("div");
      wrapper.className = "ofv-audio";
      const bytes = await readAudioBytes(ctx.file.blob);
      const title = document.createElement("div");
      title.className = "ofv-audio-title";
      title.textContent = ctx.file.name;
      const audio = document.createElement("audio");
      audio.src = url;
      audio.controls = true;
      audio.preload = "metadata";
      const infoBar = createAudioInfo(parseAudioInfo(bytes, ctx.file.extension, ctx.file.mimeType));
      infoBar.hidden = true;
      infoBar.setAttribute("aria-hidden", "true");
      infoBar.style.display = "none";
      wrapper.append(title, audio, infoBar);
      ctx.viewport.classList.add("ofv-center");
      ctx.viewport.append(wrapper);
      const formatLabel = (ctx.file.extension || ctx.file.mimeType || "audio").toUpperCase();
      const showPlaybackFallback = () => {
        audio.pause();
        audio.remove();
        infoBar.hidden = false;
        infoBar.removeAttribute("aria-hidden");
        infoBar.style.removeProperty("display");
        if (wrapper.querySelector(".ofv-fallback")) {
          return;
        }
        const fallback = document.createElement("div");
        fallback.className = "ofv-fallback";
        const fallbackTitle = document.createElement("strong");
        fallbackTitle.textContent = `\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u76F4\u63A5\u64AD\u653E\u8BE5\u97F3\u9891\u683C\u5F0F (${formatLabel})`;
        const meta = document.createElement("span");
        meta.textContent = "\u5EFA\u8BAE\u8F6C\u6362\u4E3A MP3/AAC/OGG \u7B49\u6D4F\u89C8\u5668\u517C\u5BB9\u683C\u5F0F\uFF0C\u6216\u76F4\u63A5\u4E0B\u8F7D\u5728\u672C\u5730\u64AD\u653E\u3002";
        const download = document.createElement("a");
        download.href = url;
        download.download = ctx.file.name;
        download.textContent = "\u4E0B\u8F7D\u97F3\u9891";
        fallback.append(fallbackTitle, meta, download);
        wrapper.append(fallback);
      };
      audio.addEventListener("error", showPlaybackFallback);
      return {
        destroy() {
          audio.removeEventListener("error", showPlaybackFallback);
          audio.pause();
          ctx.viewport.classList.remove("ofv-center");
          revokeObjectUrl(url, isExternal);
        }
      };
    }
  };
}
async function readAudioBytes(blob) {
  if (!blob) {
    return new Uint8Array();
  }
  return new Uint8Array(await blob.arrayBuffer().catch(() => new ArrayBuffer(0)));
}
function createAudioInfo(info) {
  const bar = document.createElement("div");
  bar.className = "ofv-media-info";
  appendMediaInfo2(bar, "\u683C\u5F0F", info.format);
  if (info.codec) {
    appendMediaInfo2(bar, "\u7F16\u7801", info.codec);
  }
  if (info.sampleRate) {
    appendMediaInfo2(bar, "\u91C7\u6837\u7387", `${info.sampleRate} Hz`);
  }
  if (info.channels) {
    appendMediaInfo2(bar, "\u58F0\u9053", String(info.channels));
  }
  if (info.bitDepth) {
    appendMediaInfo2(bar, "\u4F4D\u6DF1", `${info.bitDepth} bit`);
  }
  if (info.bitrate) {
    appendMediaInfo2(bar, "\u7801\u7387", info.bitrate);
  }
  if (info.duration) {
    appendMediaInfo2(bar, "\u65F6\u957F", info.duration);
  }
  if (info.tags) {
    appendMediaInfo2(bar, "\u6807\u7B7E", info.tags);
  }
  if (info.note) {
    appendMediaInfo2(bar, "\u8BF4\u660E", info.note);
  }
  return bar;
}
function appendMediaInfo2(parent, label, value) {
  const item = document.createElement("span");
  item.className = "ofv-media-info-item";
  const key = document.createElement("span");
  key.textContent = label;
  const content = document.createElement("strong");
  content.textContent = value;
  item.append(key, content);
  parent.append(item);
}
function parseAudioInfo(bytes, extension, mimeType) {
  const fallback = (extension || mimeType || "audio").toUpperCase();
  if (bytes.length === 0) {
    return { format: fallback, note: "\u65E0\u6CD5\u8BFB\u53D6\u672C\u5730\u5934\u4FE1\u606F" };
  }
  return parseWaveInfo(bytes) || parseFlacInfo(bytes) || parseOggInfo(bytes) || parseAiffInfo(bytes) || parseAuInfo(bytes) || parseMidiInfo(bytes) || parseAdtsAacInfo(bytes) || parseId3Mp3Info(bytes) || {
    format: fallback,
    note: "\u6682\u672A\u8BC6\u522B\u97F3\u9891\u5934\u7ED3\u6784"
  };
}
function parseWaveInfo(bytes) {
  if (bytes.length < 44 || asciiAt3(bytes, 0, 4) !== "RIFF" || asciiAt3(bytes, 8, 4) !== "WAVE") {
    return null;
  }
  let offset = 12;
  let channels = 0;
  let sampleRate = 0;
  let bitDepth = 0;
  let byteRate = 0;
  let dataBytes = 0;
  while (offset + 8 <= bytes.length) {
    const chunk = asciiAt3(bytes, offset, 4);
    const size = readUint32Le3(bytes, offset + 4);
    const dataOffset = offset + 8;
    if (chunk === "fmt " && dataOffset + 16 <= bytes.length) {
      channels = readUint16Le2(bytes, dataOffset + 2);
      sampleRate = readUint32Le3(bytes, dataOffset + 4);
      byteRate = readUint32Le3(bytes, dataOffset + 8);
      bitDepth = readUint16Le2(bytes, dataOffset + 14);
    }
    if (chunk === "data") {
      dataBytes = size;
    }
    offset += 8 + size + size % 2;
  }
  return {
    format: "WAV",
    codec: "PCM",
    sampleRate,
    channels,
    bitDepth,
    bitrate: byteRate ? `${Math.round(byteRate * 8 / 1e3)} kbps` : void 0,
    duration: byteRate && dataBytes ? formatDuration2(dataBytes / byteRate) : void 0
  };
}
function parseFlacInfo(bytes) {
  if (bytes.length < 42 || asciiAt3(bytes, 0, 4) !== "fLaC") {
    return null;
  }
  let offset = 4;
  while (offset + 4 <= bytes.length) {
    const type = bytes[offset] & 127;
    const length = bytes[offset + 1] << 16 | bytes[offset + 2] << 8 | bytes[offset + 3];
    const dataOffset = offset + 4;
    if (type === 0 && dataOffset + 34 <= bytes.length) {
      const b10 = bytes[dataOffset + 10];
      const b11 = bytes[dataOffset + 11];
      const b12 = bytes[dataOffset + 12];
      const b13 = bytes[dataOffset + 13];
      const b14 = bytes[dataOffset + 14];
      const b15 = bytes[dataOffset + 15];
      const b16 = bytes[dataOffset + 16];
      const b17 = bytes[dataOffset + 17];
      const sampleRate = b10 << 12 | b11 << 4 | (b12 & 240) >> 4;
      const channels = ((b12 & 14) >> 1) + 1;
      const bitDepth = ((b12 & 1) << 4 | (b13 & 240) >> 4) + 1;
      const totalSamples = BigInt(b13 & 15) << 32n | BigInt(b14) << 24n | BigInt(b15) << 16n | BigInt(b16) << 8n | BigInt(b17);
      return {
        format: "FLAC",
        codec: "FLAC",
        sampleRate,
        channels,
        bitDepth,
        duration: sampleRate && totalSamples > 0n ? formatDuration2(Number(totalSamples) / sampleRate) : void 0
      };
    }
    offset += 4 + length;
  }
  return { format: "FLAC", codec: "FLAC", note: "\u672A\u627E\u5230 STREAMINFO metadata block" };
}
function parseId3Mp3Info(bytes) {
  let offset = 0;
  let tags;
  if (bytes.length >= 10 && asciiAt3(bytes, 0, 3) === "ID3") {
    tags = `ID3v2.${bytes[3]}.${bytes[4]}`;
    offset = 10 + readSynchsafe(bytes, 6);
  }
  for (let index = offset; index + 3 < Math.min(bytes.length, offset + 4096); index++) {
    if (bytes[index] === 255 && (bytes[index + 1] & 224) === 224) {
      const versionBits = bytes[index + 1] >> 3 & 3;
      const layerBits = bytes[index + 1] >> 1 & 3;
      const bitrateIndex = bytes[index + 2] >> 4 & 15;
      const sampleIndex = bytes[index + 2] >> 2 & 3;
      const channelMode = bytes[index + 3] >> 6 & 3;
      return {
        format: "MP3",
        codec: `${mpegVersion(versionBits)} Layer ${mpegLayer(layerBits)}`,
        sampleRate: mp3SampleRate(versionBits, sampleIndex),
        channels: channelMode === 3 ? 1 : 2,
        bitrate: mp3Bitrate(versionBits, layerBits, bitrateIndex),
        tags
      };
    }
  }
  return tags ? { format: "MP3", tags, note: "\u672A\u5728\u5934\u90E8\u626B\u63CF\u5230 MPEG frame" } : null;
}
function parseOggInfo(bytes) {
  if (bytes.length < 36 || asciiAt3(bytes, 0, 4) !== "OggS") {
    return null;
  }
  const pages = collectOggPages(bytes);
  const firstPacket = pages[0]?.packets[0];
  const lastGranule = [...pages].reverse().find((page) => page.granule > 0n)?.granule;
  if (firstPacket && asciiAt3(firstPacket, 0, 8) === "OpusHead") {
    const preSkip = firstPacket.length >= 12 ? readUint16Le2(firstPacket, 10) : 0;
    const sampleRate = firstPacket.length >= 16 ? readUint32Le3(firstPacket, 12) : 48e3;
    const totalSamples = lastGranule === void 0 ? void 0 : lastGranule - BigInt(preSkip);
    return {
      format: "Ogg",
      codec: "Opus",
      channels: firstPacket[9],
      sampleRate,
      duration: totalSamples !== void 0 && totalSamples > 0n ? formatDuration2(Number(totalSamples) / 48e3) : void 0,
      note: `${pages.length} \u9875`
    };
  }
  if (firstPacket && firstPacket[0] === 1 && asciiAt3(firstPacket, 1, 6) === "vorbis") {
    const sampleRate = firstPacket.length >= 16 ? readUint32Le3(firstPacket, 12) : void 0;
    return {
      format: "Ogg",
      codec: "Vorbis",
      channels: firstPacket[11],
      sampleRate,
      bitrate: firstPacket.length >= 28 ? oggVorbisBitrate(firstPacket) : void 0,
      duration: sampleRate && lastGranule !== void 0 && lastGranule > 0n ? formatDuration2(Number(lastGranule) / sampleRate) : void 0,
      note: `${pages.length} \u9875`
    };
  }
  return { format: "Ogg", note: pages.length > 0 ? `\u672A\u8BC6\u522B Ogg codec header\uFF0C${pages.length} \u9875` : "\u672A\u8BC6\u522B Ogg codec header" };
}
function collectOggPages(bytes) {
  const pages = [];
  let offset = 0;
  let continuedPacket = [];
  while (offset + 27 <= bytes.length && asciiAt3(bytes, offset, 4) === "OggS") {
    const segmentCount = bytes[offset + 26];
    const segmentTableOffset = offset + 27;
    const dataOffset = segmentTableOffset + segmentCount;
    if (dataOffset > bytes.length) {
      break;
    }
    const sizes = Array.from(bytes.slice(segmentTableOffset, dataOffset));
    const payloadLength = sizes.reduce((sum, value) => sum + value, 0);
    const payloadEnd = dataOffset + payloadLength;
    if (payloadEnd > bytes.length) {
      break;
    }
    const pagePackets = [];
    let packetOffset = dataOffset;
    for (const size of sizes) {
      continuedPacket.push(...bytes.slice(packetOffset, packetOffset + size));
      packetOffset += size;
      if (size < 255) {
        pagePackets.push(new Uint8Array(continuedPacket));
        continuedPacket = [];
      }
    }
    pages.push({
      granule: readUint64Le(bytes, offset + 6),
      packets: pagePackets
    });
    offset = payloadEnd;
  }
  return pages;
}
function oggVorbisBitrate(packet) {
  const nominal = readUint32Le3(packet, 20);
  if (nominal > 0) {
    return `${Math.round(nominal / 1e3)} kbps`;
  }
  const upper = readUint32Le3(packet, 16);
  const lower = readUint32Le3(packet, 24);
  if (upper > 0 && lower > 0) {
    return `${Math.round((upper + lower) / 2 / 1e3)} kbps`;
  }
  return void 0;
}
function parseAiffInfo(bytes) {
  if (bytes.length < 12 || asciiAt3(bytes, 0, 4) !== "FORM" || !["AIFF", "AIFC"].includes(asciiAt3(bytes, 8, 4))) {
    return null;
  }
  const format = asciiAt3(bytes, 8, 4);
  let offset = 12;
  while (offset + 26 <= bytes.length) {
    const chunk = asciiAt3(bytes, offset, 4);
    const size = readUint32Be3(bytes, offset + 4);
    if (chunk === "COMM") {
      return {
        format,
        channels: readUint16Be(bytes, offset + 8),
        bitDepth: readUint16Be(bytes, offset + 14),
        sampleRate: Math.round(readAiffExtended(bytes, offset + 16))
      };
    }
    offset += 8 + size + size % 2;
  }
  return { format, note: "\u672A\u627E\u5230 COMM chunk" };
}
function parseAuInfo(bytes) {
  if (bytes.length < 24 || asciiAt3(bytes, 0, 4) !== ".snd") {
    return null;
  }
  const dataOffset = readUint32Be3(bytes, 4);
  const dataSize = readUint32Be3(bytes, 8);
  const encoding = readUint32Be3(bytes, 12);
  const sampleRate = readUint32Be3(bytes, 16);
  const channels = readUint32Be3(bytes, 20);
  const bitDepth = auBitDepth(encoding);
  const bytesPerSample = bitDepth ? bitDepth / 8 : 0;
  const resolvedDataSize = dataSize === 4294967295 ? Math.max(0, bytes.length - dataOffset) : dataSize;
  return {
    format: "AU/SND",
    codec: auEncodingName(encoding),
    sampleRate,
    channels,
    bitDepth,
    duration: sampleRate && channels && bytesPerSample && resolvedDataSize ? formatDuration2(resolvedDataSize / (sampleRate * channels * bytesPerSample)) : void 0,
    note: `data @ ${dataOffset} B`
  };
}
function auEncodingName(value) {
  const names = {
    1: "8-bit \u03BC-law",
    2: "8-bit linear PCM",
    3: "16-bit linear PCM",
    4: "24-bit linear PCM",
    5: "32-bit linear PCM",
    6: "32-bit float",
    7: "64-bit float",
    23: "G.721 ADPCM",
    24: "G.722 ADPCM",
    25: "G.723 3-bit ADPCM",
    26: "G.723 5-bit ADPCM",
    27: "8-bit A-law"
  };
  return names[value] || `encoding ${value}`;
}
function auBitDepth(value) {
  const depths = {
    1: 8,
    2: 8,
    3: 16,
    4: 24,
    5: 32,
    6: 32,
    7: 64,
    27: 8
  };
  return depths[value];
}
function parseMidiInfo(bytes) {
  if (bytes.length < 14 || asciiAt3(bytes, 0, 4) !== "MThd") {
    return null;
  }
  return {
    format: "MIDI",
    codec: `SMF ${readUint16Be(bytes, 8)}`,
    channels: readUint16Be(bytes, 10),
    note: `${readUint16Be(bytes, 12)} ticks/quarter`
  };
}
function parseAdtsAacInfo(bytes) {
  if (bytes.length < 7 || bytes[0] !== 255 || (bytes[1] & 240) !== 240) {
    return null;
  }
  const profile = (bytes[2] >> 6 & 3) + 1;
  const sampleIndex = bytes[2] >> 2 & 15;
  const channels = (bytes[2] & 1) << 2 | bytes[3] >> 6 & 3;
  return {
    format: "AAC",
    codec: `AAC ADTS profile ${profile}`,
    sampleRate: aacSampleRate(sampleIndex),
    channels: channels || void 0,
    note: "ADTS stream"
  };
}
function aacSampleRate(index) {
  return [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350][index];
}
function formatDuration2(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "";
  }
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
function asciiAt3(bytes, offset, length) {
  if (offset < 0 || offset + length > bytes.length) {
    return "";
  }
  return new TextDecoder("ascii").decode(bytes.slice(offset, offset + length));
}
function view2(bytes) {
  return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}
function readUint16Le2(bytes, offset) {
  return view2(bytes).getUint16(offset, true);
}
function readUint16Be(bytes, offset) {
  return view2(bytes).getUint16(offset, false);
}
function readUint32Le3(bytes, offset) {
  return view2(bytes).getUint32(offset, true);
}
function readUint32Be3(bytes, offset) {
  return view2(bytes).getUint32(offset, false);
}
function readUint64Le(bytes, offset) {
  return BigInt(readUint32Le3(bytes, offset + 4)) << 32n | BigInt(readUint32Le3(bytes, offset));
}
function readSynchsafe(bytes, offset) {
  return (bytes[offset] & 127) << 21 | (bytes[offset + 1] & 127) << 14 | (bytes[offset + 2] & 127) << 7 | bytes[offset + 3] & 127;
}
function mpegVersion(bits) {
  return bits === 3 ? "MPEG-1" : bits === 2 ? "MPEG-2" : bits === 0 ? "MPEG-2.5" : "MPEG";
}
function mpegLayer(bits) {
  return bits === 3 ? "I" : bits === 2 ? "II" : bits === 1 ? "III" : "?";
}
function mp3SampleRate(versionBits, index) {
  const rates = versionBits === 3 ? [44100, 48e3, 32e3] : versionBits === 2 ? [22050, 24e3, 16e3] : [11025, 12e3, 8e3];
  return rates[index];
}
function mp3Bitrate(versionBits, layerBits, index) {
  const mpeg1Layer3 = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
  const mpeg2Layer3 = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
  if (index <= 0 || index >= 15 || layerBits !== 1) {
    return void 0;
  }
  return `${(versionBits === 3 ? mpeg1Layer3 : mpeg2Layer3)[index]} kbps`;
}
function readAiffExtended(bytes, offset) {
  const exponent = readUint16Be(bytes, offset) & 32767;
  let mantissa = 0;
  for (let index = 0; index < 8; index++) {
    mantissa = mantissa * 256 + bytes[offset + 2 + index];
  }
  return mantissa * Math.pow(2, exponent - 16383 - 63);
}

// src/plugins/text.ts
var langMap = {
  js: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  tsx: "tsx",
  jsx: "jsx",
  html: "markup",
  htm: "markup",
  vue: "markup",
  xml: "markup",
  css: "css",
  scss: "scss",
  less: "less",
  json: "json",
  jsonc: "json",
  json5: "json5",
  ipynb: "json",
  jsonl: "json",
  ndjson: "json",
  toml: "toml",
  ini: "ini",
  properties: "properties",
  proto: "protobuf",
  tf: "hcl",
  tfvars: "hcl",
  hcl: "hcl",
  tex: "latex",
  latex: "latex",
  bib: "latex",
  gv: "dot",
  http: "http",
  py: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
  h: "c",
  hpp: "cpp",
  cs: "csharp",
  go: "go",
  rs: "rust",
  rb: "ruby",
  swift: "swift",
  kt: "kotlin",
  kts: "kotlin",
  scala: "scala",
  lua: "lua",
  r: "r",
  dart: "dart",
  svelte: "markup",
  astro: "markup",
  elm: "elm",
  ex: "elixir",
  exs: "elixir",
  clj: "clojure",
  cljs: "clojure",
  erl: "erlang",
  hrl: "erlang",
  fs: "fsharp",
  fsx: "fsharp",
  hs: "haskell",
  lhs: "haskell",
  sql: "sql",
  sh: "bash",
  bash: "bash",
  zsh: "bash",
  fish: "bash",
  ps1: "powershell",
  bat: "batch",
  cmd: "batch",
  dockerfile: "docker",
  nginxconf: "nginx",
  gradle: "groovy",
  graphql: "graphql",
  gql: "graphql",
  yaml: "yaml",
  yml: "yaml",
  diff: "diff",
  patch: "diff",
  php: "php",
  md: "markdown",
  markdown: "markdown"
};
var filenameLangMap = {
  dockerfile: "docker",
  makefile: "makefile",
  gemfile: "ruby",
  rakefile: "ruby",
  procfile: "bash",
  jenkinsfile: "groovy",
  vagrantfile: "ruby",
  brewfile: "ruby",
  podfile: "ruby",
  "go.mod": "go",
  "go.sum": "go",
  "cargo.toml": "toml",
  "cargo.lock": "toml",
  ".gitignore": "none",
  ".dockerignore": "ignore",
  ".npmrc": "none",
  ".yarnrc": "none",
  ".pnpmrc": "none",
  ".editorconfig": "editorconfig",
  ".browserslistrc": "none",
  ".prettierrc": "json",
  ".eslintrc": "json",
  ".stylelintrc": "json",
  readme: "markdown",
  changelog: "markdown",
  changes: "markdown",
  history: "markdown",
  license: "none",
  licence: "none",
  copying: "none",
  notice: "none",
  authors: "none",
  contributors: "none",
  codeowners: "none"
};
var mimeLangMap = {
  "text/markdown": "markdown",
  "text/html": "markup",
  "application/xml": "markup",
  "text/xml": "markup",
  "application/json": "json",
  "application/json5": "json5",
  "application/x-ipynb+json": "json",
  "application/x-ndjson": "json",
  "application/yaml": "yaml",
  "application/x-yaml": "yaml",
  "text/yaml": "yaml",
  "application/javascript": "javascript",
  "application/x-javascript": "javascript",
  "text/javascript": "javascript",
  "application/typescript": "typescript",
  "application/x-typescript": "typescript",
  "text/typescript": "typescript",
  "application/sql": "sql",
  "application/x-sh": "bash",
  "application/graphql": "graphql",
  "text/calendar": "none",
  "text/vcard": "none",
  "application/x-pem-file": "none",
  "application/x-x509-ca-cert": "none",
  "application/pkix-cert": "none",
  "application/x-httpd-php": "php",
  "application/x-tex": "latex",
  "message/http": "http",
  "text/x-bibtex": "latex",
  "text/x-hcl": "hcl",
  "text/x-protobuf": "protobuf",
  "text/vnd.graphviz": "dot",
  "text/css": "css"
};
var MAX_HIGHLIGHT_CHARS = 18e4;
var MAX_RENDER_CHARS = 6e5;
function loadPrismCss(theme) {
  const lightId = "ofv-prism-css-light";
  const darkId = "ofv-prism-css-dark";
  const activeId = theme === "dark" ? darkId : lightId;
  const inactiveId = theme === "dark" ? lightId : darkId;
  document.getElementById(inactiveId)?.remove();
  if (document.getElementById(activeId)) {
    return Promise.resolve();
  }
  const href = theme === "dark" ? "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css" : "https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism.min.css";
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.id = activeId;
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load Prism CSS: ${href}`));
    document.head.appendChild(link);
  });
}
function textPlugin() {
  return {
    name: "text",
    match(file) {
      return isTextLike(file);
    },
    async render(ctx) {
      const ext = ctx.file.extension.toLowerCase();
      const lang = getTextLanguage(ctx.file.name, ext, ctx.file.mimeType);
      const defaultWrapped = lang === "none";
      const isMarkdown = lang === "markdown";
      const text = await readText(ctx.file.source).catch((error) => void 0);
      if (text === void 0) {
        const fallback = createTextFallback(ctx.file.name, ctx.file.url);
        ctx.viewport.classList.add("ofv-center");
        ctx.viewport.append(fallback);
        return {
          destroy() {
            ctx.viewport.classList.remove("ofv-center");
            fallback.remove();
          }
        };
      }
      const isDark = ctx.host.parentElement?.classList.contains("ofv-theme-dark") || document.body.classList.contains("ofv-theme-dark") || ctx.options.theme === "auto" && window.matchMedia?.("(prefers-color-scheme: dark)").matches || ctx.options.theme === "dark";
      if (isMarkdown) {
        const [markedModule, PrismModule2, DOMPurifyModule] = await Promise.all([
          import("marked"),
          import("prismjs"),
          import("dompurify")
        ]);
        const parseMarkdown = markedModule.marked?.parse || markedModule.parse || markedModule.default?.parse;
        const Prism2 = PrismModule2.default || PrismModule2;
        const DOMPurify4 = DOMPurifyModule.default || DOMPurifyModule;
        const container = document.createElement("div");
        container.className = "ofv-markdown-body";
        container.innerHTML = DOMPurify4.sanitize(parseMarkdown(text), {
          USE_PROFILES: { html: true },
          ADD_ATTR: ["target"]
        });
        secureMarkdownLinks(container);
        ctx.viewport.appendChild(container);
        try {
          const codeBlocks = container.querySelectorAll("pre code");
          if (codeBlocks.length > 0) {
            await loadPrismCss(isDark ? "dark" : "light");
            codeBlocks.forEach((block) => {
              const parent = block.parentElement;
              if (parent && !parent.className.includes("language-")) {
                parent.className = "language-none";
              }
              Prism2.highlightElement(block);
            });
          }
        } catch (e) {
          console.warn("Prism highlight for markdown failed:", e);
        }
        const markdownZoom = createTextZoomController(container, "--ofv-markdown-zoom", ctx);
        return {
          canCommand(command) {
            return markdownZoom.canCommand(command);
          },
          command(command) {
            return markdownZoom.command(command);
          },
          destroy() {
            container.remove();
          }
        };
      }
      const [PrismModule] = await Promise.all([import("prismjs")]);
      const Prism = PrismModule.default || PrismModule;
      if (lang !== "none") {
        try {
          if (lang === "typescript" || lang === "tsx") {
            await import("prismjs/components/prism-typescript");
          } else if (lang === "python") {
            await import("prismjs/components/prism-python");
          } else if (lang === "json") {
            await import("prismjs/components/prism-json");
          } else if (lang === "json5") {
            await import("prismjs/components/prism-json5");
          } else if (lang === "yaml") {
            await import("prismjs/components/prism-yaml");
          } else if (lang === "toml") {
            await import("prismjs/components/prism-toml");
          } else if (lang === "ini") {
            await import("prismjs/components/prism-ini");
          } else if (lang === "properties") {
            await import("prismjs/components/prism-properties");
          } else if (lang === "editorconfig") {
            await import("prismjs/components/prism-editorconfig");
          } else if (lang === "ignore") {
            await import("prismjs/components/prism-ignore");
          } else if (lang === "protobuf") {
            await import("prismjs/components/prism-protobuf");
          } else if (lang === "hcl") {
            await import("prismjs/components/prism-hcl");
          } else if (lang === "latex") {
            await import("prismjs/components/prism-latex");
          } else if (lang === "dot") {
            await import("prismjs/components/prism-dot");
          } else if (lang === "http") {
            await import("prismjs/components/prism-http");
          } else if (lang === "bash") {
            await import("prismjs/components/prism-bash");
          } else if (lang === "powershell") {
            await import("prismjs/components/prism-powershell");
          } else if (lang === "batch") {
            await import("prismjs/components/prism-batch");
          } else if (lang === "docker") {
            await import("prismjs/components/prism-docker");
          } else if (lang === "makefile") {
            await import("prismjs/components/prism-makefile");
          } else if (lang === "ruby") {
            await import("prismjs/components/prism-ruby");
          } else if (lang === "nginx") {
            await import("prismjs/components/prism-nginx");
          } else if (lang === "groovy") {
            await import("prismjs/components/prism-groovy");
          } else if (lang === "graphql") {
            await import("prismjs/components/prism-graphql");
          } else if (lang === "csharp") {
            await import("prismjs/components/prism-csharp");
          } else if (lang === "rust") {
            await import("prismjs/components/prism-rust");
          } else if (lang === "go") {
            await import("prismjs/components/prism-go");
          } else if (lang === "ruby") {
            await import("prismjs/components/prism-ruby");
          } else if (lang === "swift") {
            await import("prismjs/components/prism-swift");
          } else if (lang === "kotlin") {
            await import("prismjs/components/prism-kotlin");
          } else if (lang === "scala") {
            await import("prismjs/components/prism-scala");
          } else if (lang === "lua") {
            await import("prismjs/components/prism-lua");
          } else if (lang === "r") {
            await import("prismjs/components/prism-r");
          } else if (lang === "dart") {
            await import("prismjs/components/prism-dart");
          } else if (lang === "elm") {
            await import("prismjs/components/prism-elm");
          } else if (lang === "elixir") {
            await import("prismjs/components/prism-elixir");
          } else if (lang === "clojure") {
            await import("prismjs/components/prism-clojure");
          } else if (lang === "erlang") {
            await import("prismjs/components/prism-erlang");
          } else if (lang === "fsharp") {
            await import("prismjs/components/prism-fsharp");
          } else if (lang === "haskell") {
            await import("prismjs/components/prism-haskell");
          } else if (lang === "sql") {
            await import("prismjs/components/prism-sql");
          } else if (lang === "cpp") {
            await import("prismjs/components/prism-c");
            await import("prismjs/components/prism-cpp");
          } else if (lang === "java") {
            await import("prismjs/components/prism-java");
          } else if (lang === "php") {
            await import("prismjs/components/prism-markup-templating");
            await import("prismjs/components/prism-php");
          }
        } catch (e) {
          console.warn(`Prism failed to load language component for: ${lang}`, e);
        }
      }
      await loadPrismCss(isDark ? "dark" : "light").catch((error) => {
        console.warn("Prism CSS failed to load; rendering code without external theme:", error);
      });
      const codeText = text.length > MAX_RENDER_CHARS ? text.slice(0, MAX_RENDER_CHARS) : text;
      const totalLines = countLines(text);
      const shownLines = countLines(codeText);
      const truncated = codeText.length < text.length;
      const shouldHighlight = codeText.length <= MAX_HIGHLIGHT_CHARS;
      const wrapper = document.createElement("div");
      wrapper.className = "ofv-code-container";
      if (truncated) {
        wrapper.classList.add("is-truncated");
      }
      if (defaultWrapped) {
        wrapper.classList.add("is-wrapped");
      }
      const header = document.createElement("div");
      header.className = "ofv-code-header";
      const title = document.createElement("div");
      title.className = "ofv-code-title";
      const fileName = document.createElement("strong");
      fileName.textContent = ctx.file.name;
      const meta = document.createElement("span");
      meta.textContent = [
        lang === "none" ? "plain text" : lang,
        `${totalLines.toLocaleString()} lines`,
        formatBytes(ctx.file.size ?? (ctx.file.source instanceof Blob ? ctx.file.source.size : text.length))
      ].join(" \xB7 ");
      title.append(fileName, meta);
      const actions = document.createElement("div");
      actions.className = "ofv-code-actions";
      const status = document.createElement("span");
      status.className = "ofv-code-status";
      status.setAttribute("role", "status");
      const wrapButton = document.createElement("button");
      wrapButton.type = "button";
      wrapButton.className = "ofv-code-action";
      wrapButton.textContent = "Wrap";
      wrapButton.setAttribute("aria-pressed", String(defaultWrapped));
      wrapButton.addEventListener("click", () => {
        const wrapped = wrapper.classList.toggle("is-wrapped");
        wrapButton.setAttribute("aria-pressed", String(wrapped));
      });
      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className = "ofv-code-action";
      copyButton.textContent = "Copy";
      copyButton.addEventListener("click", async () => {
        copyButton.disabled = true;
        try {
          await copyToClipboard(text);
          status.textContent = "Copied";
        } catch {
          status.textContent = "Copy failed";
        } finally {
          copyButton.disabled = false;
        }
      });
      const downloadButton = document.createElement("button");
      downloadButton.type = "button";
      downloadButton.className = "ofv-code-action";
      downloadButton.textContent = "Download";
      downloadButton.addEventListener("click", () => {
        downloadText(ctx.file.name, text);
        status.textContent = "Download ready";
      });
      actions.append(wrapButton, copyButton, downloadButton, status);
      header.append(title, actions);
      const structureSummary = createTextStructureSummary(text, ext, lang, ctx.file.mimeType);
      const body = document.createElement("div");
      body.className = "ofv-code-body";
      const gutter = document.createElement("pre");
      gutter.className = "ofv-code-gutter";
      gutter.setAttribute("aria-hidden", "true");
      gutter.textContent = createLineNumbers(shownLines);
      const pre = document.createElement("pre");
      pre.className = `language-${lang}`;
      const code = document.createElement("code");
      code.className = `language-${lang}`;
      code.textContent = codeText;
      pre.appendChild(code);
      body.append(gutter, pre);
      wrapper.append(header);
      if (structureSummary) {
        wrapper.append(structureSummary);
      }
      if (truncated) {
        const notice = document.createElement("div");
        notice.className = "ofv-code-notice";
        notice.textContent = `\u6587\u4EF6\u8F83\u5927\uFF0C\u5F53\u524D\u5C55\u793A\u524D ${formatBytes(codeText.length)}\uFF0C\u590D\u5236\u548C\u4E0B\u8F7D\u4ECD\u4F1A\u4F7F\u7528\u5B8C\u6574\u5185\u5BB9\u3002`;
        wrapper.append(notice);
      }
      if (!shouldHighlight) {
        const notice = document.createElement("div");
        notice.className = "ofv-code-notice";
        notice.textContent = "\u5185\u5BB9\u8F83\u5927\uFF0C\u5DF2\u8DF3\u8FC7\u8BED\u6CD5\u9AD8\u4EAE\u4EE5\u4FDD\u6301\u6EDA\u52A8\u6D41\u7545\u3002";
        wrapper.append(notice);
      }
      wrapper.appendChild(body);
      ctx.viewport.appendChild(wrapper);
      if (shouldHighlight) {
        try {
          Prism.highlightElement(code);
        } catch (err) {
          console.error("Prism syntax highlighting failed:", err);
        }
      }
      const codeZoom = createTextZoomController(wrapper, "--ofv-text-zoom", ctx);
      return {
        canCommand(command) {
          return codeZoom.canCommand(command);
        },
        command(command) {
          return codeZoom.command(command);
        },
        destroy() {
          wrapper.remove();
        }
      };
    }
  };
}
function createTextZoomController(target, cssVariable, ctx) {
  let zoom = getInitialZoom(ctx, 0.5, 3);
  const apply = () => {
    const normalized = Math.round(zoom * 100) / 100;
    target.style.setProperty(cssVariable, String(normalized));
    ctx.toolbar?.setZoom(normalized === 1 ? void 0 : normalized);
  };
  apply();
  return {
    canCommand(command) {
      return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset";
    },
    command(command) {
      if (command === "zoom-in") {
        zoom = Math.min(3, zoom * 1.15);
        apply();
        return true;
      }
      if (command === "zoom-out") {
        zoom = Math.max(0.5, zoom / 1.15);
        apply();
        return true;
      }
      if (command === "zoom-reset") {
        zoom = 1;
        apply();
        return true;
      }
      return false;
    }
  };
}
function getTextLanguage(fileName, extension, mimeType) {
  const normalizedFileName = normalizeFileName2(fileName);
  return langMap[extension] || filenameLangMap[normalizedFileName] || filenameLangMap[normalizedFileName.split(".")[0]] || mimeLangMap[mimeType.toLowerCase()] || "none";
}
function normalizeFileName2(name) {
  const baseName = name.split(/[\\/]/).pop() || name;
  return baseName.toLowerCase();
}
function createTextFallback(fileName, url) {
  const fallback = document.createElement("div");
  fallback.className = "ofv-fallback";
  const title = document.createElement("strong");
  title.textContent = "\u6587\u672C\u9884\u89C8\u5931\u8D25";
  const meta = document.createElement("span");
  meta.textContent = "\u65E0\u6CD5\u8BFB\u53D6\u8BE5\u6587\u672C\u5185\u5BB9\uFF0C\u53EF\u80FD\u662F\u8FDC\u7A0B\u6587\u4EF6\u4E0D\u53EF\u8BBF\u95EE\u6216\u54CD\u5E94\u72B6\u6001\u5F02\u5E38\u3002";
  fallback.append(title, meta);
  if (url) {
    const download = document.createElement("a");
    download.href = url;
    download.download = fileName;
    download.textContent = "\u6253\u5F00\u539F\u6587\u4EF6";
    fallback.append(download);
  }
  return fallback;
}
function secureMarkdownLinks(container) {
  for (const link of container.querySelectorAll("a[href]")) {
    const href = link.getAttribute("href") || "";
    if (!isSafeMarkdownHref(href)) {
      link.removeAttribute("href");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      continue;
    }
    if (/^(https?:)?\/\//i.test(href)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  }
}
function isSafeMarkdownHref(href) {
  const trimmed = href.trim();
  return trimmed.startsWith("#") || trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../") || /^(https?:|mailto:|tel:)/i.test(trimmed);
}
function countLines(text) {
  if (!text) {
    return 1;
  }
  return text.split(/\r\n|\r|\n/).length;
}
function createTextStructureSummary(text, extension, language, mimeType) {
  if (text.length > MAX_RENDER_CHARS) {
    return null;
  }
  const items = summarizeTextStructure(text, extension, language, mimeType);
  if (items.length === 0) {
    return null;
  }
  const summary = document.createElement("div");
  summary.className = "ofv-text-structure";
  summary.hidden = true;
  summary.setAttribute("aria-hidden", "true");
  summary.style.display = "none";
  for (const item of items) {
    const row = document.createElement("span");
    const label = document.createElement("span");
    label.textContent = item.label;
    const value = document.createElement("strong");
    value.textContent = item.value;
    row.append(label, value);
    summary.append(row);
  }
  return summary;
}
function summarizeTextStructure(text, extension, language, mimeType) {
  if (extension === "ipynb" || mimeType === "application/x-ipynb+json") {
    return summarizeNotebook(text);
  }
  if (extension === "ndjson" || extension === "jsonl" || mimeType === "application/x-ndjson") {
    return summarizeNdjson(text);
  }
  if (language === "json" || language === "json5") {
    return summarizeJson(text);
  }
  return [];
}
function summarizeJson(text) {
  try {
    const data = JSON.parse(text);
    if (Array.isArray(data)) {
      return [
        { label: "\u7ED3\u6784", value: "Array" },
        { label: "\u6761\u76EE", value: String(data.length) }
      ];
    }
    if (data && typeof data === "object") {
      const keys = Object.keys(data);
      return [
        { label: "\u7ED3\u6784", value: "Object" },
        { label: "\u952E", value: String(keys.length) },
        { label: "\u9884\u89C8", value: keys.slice(0, 8).join(", ") || "\u65E0\u952E" }
      ];
    }
    return [{ label: "\u7ED3\u6784", value: typeof data }];
  } catch {
    return [];
  }
}
function summarizeNotebook(text) {
  try {
    const notebook = JSON.parse(text);
    if (!Array.isArray(notebook.cells)) {
      return summarizeJson(text);
    }
    const counts = /* @__PURE__ */ new Map();
    for (const cell of notebook.cells) {
      const type = cell.cell_type || "unknown";
      counts.set(type, (counts.get(type) || 0) + 1);
    }
    const kernel = notebook.metadata?.kernelspec?.display_name || notebook.metadata?.kernelspec?.name || notebook.metadata?.language_info?.name;
    return [
      { label: "Notebook", value: `${notebook.cells.length} cells` },
      { label: "\u7C7B\u578B", value: [...counts.entries()].map(([type, count]) => `${type} ${count}`).join(", ") || "\u672A\u77E5" },
      ...kernel ? [{ label: "Kernel", value: kernel }] : []
    ];
  } catch {
    return [];
  }
}
function summarizeNdjson(text) {
  const lines = text.split(/\r\n|\r|\n/).filter((line) => line.trim());
  let parsed = 0;
  let objects = 0;
  let arrays = 0;
  for (const line of lines.slice(0, 1e3)) {
    try {
      const value = JSON.parse(line);
      parsed++;
      if (Array.isArray(value)) {
        arrays++;
      } else if (value && typeof value === "object") {
        objects++;
      }
    } catch {
    }
  }
  return [
    { label: "NDJSON", value: `${lines.length} lines` },
    { label: "\u53EF\u89E3\u6790", value: String(parsed) },
    { label: "\u7C7B\u578B", value: `object ${objects}, array ${arrays}` }
  ];
}
function createLineNumbers(lines) {
  return Array.from({ length: Math.max(lines, 1) }, (_, index) => String(index + 1)).join("\n");
}
function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    return "0 B";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }
  return `${value.toFixed(value >= 10 ? 1 : 2)} ${units[unitIndex]}`;
}
async function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand?.("copy");
  textarea.remove();
  if (!copied) {
    throw new Error("Clipboard API is not available.");
  }
}
function downloadText(fileName, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
async function readText(source) {
  if (typeof source === "string") {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(`Failed to fetch text file: ${response.status}`);
    }
    return decodeTextBuffer(await response.arrayBuffer());
  }
  if (source instanceof Blob) {
    return decodeTextBuffer(await source.arrayBuffer());
  }
  if (source instanceof ArrayBuffer) {
    return decodeTextBuffer(source);
  }
  return String(source);
}

// src/plugins/encrypted.ts
function createEncryptedFallback(file, url, copy = {}) {
  const fallback = document.createElement("div");
  fallback.className = "ofv-fallback ofv-encrypted";
  const title = document.createElement("strong");
  title.textContent = copy.title || "\u6587\u4EF6\u5DF2\u52A0\u5BC6\uFF0C\u65E0\u6CD5\u5728\u7EBF\u9884\u89C8";
  const message = document.createElement("span");
  message.textContent = copy.message || "\u8BF7\u4E0B\u8F7D\u540E\u5728\u672C\u5730\u8F93\u5165\u5BC6\u7801\u6253\u5F00\uFF0C\u6216\u4E0A\u4F20\u89E3\u5BC6\u540E\u7684\u6587\u4EF6\u3002";
  const meta = document.createElement("dl");
  meta.className = "ofv-fallback-meta ofv-encrypted-meta";
  appendEncryptedMeta(meta, "\u6587\u4EF6", file.name || "\u672A\u547D\u540D\u6587\u4EF6");
  appendEncryptedMeta(meta, "\u683C\u5F0F", file.extension ? `.${file.extension}` : file.mimeType || "\u672A\u77E5");
  const download = document.createElement("a");
  download.href = url;
  download.download = file.name;
  download.textContent = copy.action || "\u4E0B\u8F7D\u6587\u4EF6";
  fallback.append(title, message, meta, download);
  return fallback;
}
function isEncryptedError(error) {
  const message = error instanceof Error ? error.message : String(error || "");
  const name = typeof error === "object" && error !== null && "name" in error ? String(error.name) : "";
  return /\b(password|encrypted|encrypt|protected|decrypt|permission|加密|密码|受保护)\b/i.test(`${name} ${message}`);
}
function appendEncryptedMeta(parent, label, value) {
  const key = document.createElement("dt");
  key.textContent = label;
  const content = document.createElement("dd");
  content.textContent = value;
  parent.append(key, content);
}

// src/plugins/pdf.ts
function multiplyMatrices(m1, m2) {
  return [
    m1[0] * m2[0] + m1[2] * m2[1],
    m1[1] * m2[0] + m1[3] * m2[1],
    m1[0] * m2[2] + m1[2] * m2[3],
    m1[1] * m2[2] + m1[3] * m2[3],
    m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
    m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
  ];
}
function pdfPlugin(options = {}) {
  return {
    name: "pdf",
    match(file) {
      return file.mimeType === "application/pdf" || file.extension === "pdf";
    },
    async render(ctx) {
      const normalizedOptions = normalizePdfOptions(options);
      const url = createObjectUrl(ctx.file);
      const isExternal = Boolean(ctx.file.url);
      return renderPdfDocumentPreview({
        ...normalizedOptions,
        fileName: ctx.file.name,
        fileUrl: url,
        fileSize: ctx.file.size,
        isExternal,
        viewport: ctx.viewport,
        size: ctx.size,
        fit: ctx.options.fit,
        zoom: ctx.options.zoom,
        toolbar: ctx.toolbar,
        encryptedTitle: "PDF \u5DF2\u52A0\u5BC6\uFF0C\u65E0\u6CD5\u5728\u7EBF\u9884\u89C8",
        encryptedMessage: "\u8BF7\u4E0B\u8F7D\u540E\u4F7F\u7528\u5BC6\u7801\u6253\u5F00\uFF0C\u6216\u4E0A\u4F20\u89E3\u5BC6\u540E\u7684 PDF \u6587\u4EF6\u3002",
        encryptedAction: "\u4E0B\u8F7D PDF",
        revokeUrlOnDestroy: true
      });
    }
  };
}
async function renderPdfDocumentPreview(options) {
  const pdf = options.pdfjs || await import("pdfjs-dist");
  configurePdfWorker(pdf, options.workerSrc);
  const viewer = document.createElement("div");
  viewer.className = "ofv-pdf-viewer";
  if (options.title) {
    const title = document.createElement("strong");
    title.className = "ofv-pdf-viewer-title";
    title.textContent = options.title;
    viewer.append(title);
  }
  const summary = document.createElement("div");
  summary.className = "ofv-pdf-summary";
  summary.hidden = true;
  summary.setAttribute("aria-hidden", "true");
  summary.style.display = "none";
  const scroller = document.createElement("div");
  scroller.className = "ofv-pdf ofv-pdf-pages";
  viewer.append(summary, scroller);
  options.viewport.append(viewer);
  const showDocumentFallback = (error) => {
    viewer.remove();
    options.viewport.classList.add("ofv-center");
    const fileLike = {
      source: options.fileUrl,
      name: options.fileName,
      extension: options.fileName.includes(".") ? options.fileName.split(".").pop() || "pdf" : "pdf",
      mimeType: "application/pdf",
      size: options.fileSize,
      url: options.fileUrl
    };
    const fallback = isEncryptedError(error) ? createEncryptedFallback(fileLike, options.fileUrl, {
      title: options.encryptedTitle || "PDF \u5DF2\u52A0\u5BC6\uFF0C\u65E0\u6CD5\u5728\u7EBF\u9884\u89C8",
      message: options.encryptedMessage || "\u8BF7\u4E0B\u8F7D\u540E\u4F7F\u7528\u5BC6\u7801\u6253\u5F00\uFF0C\u6216\u4E0A\u4F20\u89E3\u5BC6\u540E\u7684 PDF \u6587\u4EF6\u3002",
      action: options.encryptedAction || "\u4E0B\u8F7D PDF"
    }) : createPdfFallback(options.fileName, options.fileUrl, normalizePdfError(error), options.fallbackTitle);
    options.viewport.append(fallback);
  };
  let documentTask;
  let doc;
  try {
    const pdfData = options.useFetchData ? await loadPdfData(options.fileUrl) : void 0;
    documentTask = pdf.getDocument({
      ...pdfData ? { data: pdfData } : { url: options.fileUrl },
      cMapUrl: options.cMapUrl ?? `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdf.version}/cmaps/`,
      cMapPacked: options.cMapPacked ?? true,
      standardFontDataUrl: options.standardFontDataUrl ?? `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdf.version}/standard_fonts/`,
      useSystemFonts: options.useSystemFonts ?? true,
      disableStream: options.disableStream,
      disableAutoFetch: options.disableAutoFetch,
      disableRange: options.disableRange,
      rangeChunkSize: options.rangeChunkSize
    });
    doc = await documentTask.promise.catch((error) => {
      showDocumentFallback(error);
      return void 0;
    });
  } catch (error) {
    showDocumentFallback(error);
  }
  if (!doc) {
    return {
      canCommand() {
        return false;
      },
      command() {
        return false;
      },
      resize() {
      },
      destroy() {
        options.viewport.classList.remove("ofv-center");
        destroyPdfResource(documentTask);
        if (options.revokeUrlOnDestroy) {
          revokeObjectUrl(options.fileUrl, Boolean(options.isExternal));
        }
      }
    };
  }
  const pdfDocument = doc;
  const pagesMeta = [];
  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
    try {
      const page = await pdfDocument.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      pagesMeta.push({
        width: baseViewport.width,
        height: baseViewport.height
      });
    } catch {
      pagesMeta.push({ width: 612, height: 792 });
    }
  }
  const pageStates = [];
  let observer = null;
  let currentSize = options.size;
  let zoomFactor = getInitialZoom({ options: { zoom: options.zoom ?? 1 } }, 0.25, 4);
  let rotation = 0;
  const updateSummary = () => {
    renderPdfSummary(summary, pdfDocument.numPages, pagesMeta, options.fit, zoomFactor);
    options.toolbar?.setZoom(zoomFactor);
  };
  const clearPage = (pageIdx) => {
    const state = pageStates[pageIdx];
    if (!state || !state.rendered) return;
    if (state.renderTask) {
      try {
        state.renderTask.cancel();
      } catch (e) {
      }
      state.renderTask = null;
    }
    state.canvas = null;
    state.rendered = false;
    state.wrapper.replaceChildren();
    state.wrapper.append(createPageStatus("ofv-pdf-skeleton", `\u9875\u9762 ${pageIdx + 1} \u52A0\u8F7D\u4E2D...`));
  };
  const renderPage = async (pageIdx, size) => {
    const state = pageStates[pageIdx];
    if (!state || state.rendered) return;
    state.rendered = true;
    try {
      const page = await pdfDocument.getPage(pageIdx + 1);
      const meta = pagesMeta[pageIdx];
      const scale = options.fit === "actual" ? zoomFactor : Math.max(0.05, Math.min(5, getPdfAvailableWidth(size.width) / rotatedPdfWidth(meta, rotation) * zoomFactor));
      const viewport = page.getViewport({ scale, rotation });
      const outputScale = getPdfOutputScale();
      const cssWidth = Math.floor(viewport.width);
      const cssHeight = Math.floor(viewport.height);
      const canvas = document.createElement("canvas");
      canvas.className = "ofv-pdf-page";
      canvas.width = Math.floor(cssWidth * outputScale);
      canvas.height = Math.floor(cssHeight * outputScale);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Canvas 2D context is not available.");
      }
      state.wrapper.replaceChildren(canvas);
      state.canvas = canvas;
      const renderTask = page.render({
        canvasContext: context,
        viewport,
        transform: outputScale === 1 ? void 0 : [outputScale, 0, 0, outputScale, 0, 0]
      });
      state.renderTask = renderTask;
      await renderTask.promise;
      state.renderTask = null;
      const textContent = await page.getTextContent();
      const textLayer = document.createElement("div");
      textLayer.className = "ofv-pdf-text-layer";
      textLayer.style.width = `${cssWidth}px`;
      textLayer.style.height = `${cssHeight}px`;
      state.wrapper.appendChild(textLayer);
      for (const item of textContent.items) {
        if (!("str" in item)) continue;
        const str = item.str;
        if (!str.trim()) continue;
        const tx = multiplyMatrices(viewport.transform, item.transform);
        const fontHeight = Math.sqrt(tx[2] * tx[2] + tx[3] * tx[3]);
        const span = document.createElement("span");
        span.textContent = str;
        span.style.fontSize = `${fontHeight}px`;
        span.style.fontFamily = item.fontName || "sans-serif";
        span.style.left = `${tx[4]}px`;
        span.style.top = `${tx[5] - fontHeight}px`;
        span.style.transformOrigin = "0% 0%";
        textLayer.appendChild(span);
        if (item.width) {
          const itemWidth = item.width * scale;
          const actualWidth = span.offsetWidth || span.getBoundingClientRect().width;
          if (actualWidth > 0 && Math.abs(actualWidth - itemWidth) > 1) {
            span.style.transform = `scaleX(${itemWidth / actualWidth})`;
          }
        }
      }
      if (textLayer.childElementCount === 0 && isCanvasVisuallyBlank(canvas, context)) {
        state.wrapper.appendChild(
          createPageStatus(
            "ofv-pdf-empty",
            "\u8BE5\u9875\u6CA1\u6709\u68C0\u6D4B\u5230\u53EF\u663E\u793A\u7684 PDF \u517C\u5BB9\u5185\u5BB9\u3002\u82E5\u8FD9\u662F Illustrator/AI \u6587\u4EF6\uFF0C\u53EF\u80FD\u53EA\u5305\u542B\u79C1\u6709\u7F16\u8F91\u6570\u636E\uFF0C\u5EFA\u8BAE\u5BFC\u51FA\u4E3A PDF/SVG/PNG \u540E\u9884\u89C8\u3002"
          )
        );
      }
    } catch (err) {
      console.error(`Failed to render PDF page ${pageIdx + 1}:`, err);
      state.rendered = false;
      state.wrapper.replaceChildren(
        createPageStatus("ofv-pdf-error", "\u65E0\u6CD5\u6E32\u67D3\u8BE5\u9875\u9762\u3002\u8BE5\u9875\u53EF\u80FD\u5305\u542B\u6D4F\u89C8\u5668 PDF \u5F15\u64CE\u6682\u4E0D\u652F\u6301\u7684\u56FE\u5F62\u3001\u5B57\u4F53\u6216\u538B\u7F29\u7279\u6027\u3002")
      );
    }
  };
  const renderLayout = (size) => {
    observer?.disconnect();
    updateSummary();
    scroller.replaceChildren();
    pageStates.length = 0;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const pageIdx = parseInt(entry.target.getAttribute("data-page-index") || "0", 10);
            const state = pageStates[pageIdx];
            if (!state) return;
            if (entry.isIntersecting) {
              if (!state.rendered) {
                void renderPage(pageIdx, size);
              }
            } else if (state.rendered && pdfDocument.numPages > 8) {
              clearPage(pageIdx);
            }
          });
        },
        {
          root: scroller,
          rootMargin: "400px 0px 400px 0px"
        }
      );
    }
    for (let i = 0; i < pdfDocument.numPages; i++) {
      const meta = pagesMeta[i];
      const rotatedWidth = rotatedPdfWidth(meta, rotation);
      const rotatedHeight = rotatedPdfHeight(meta, rotation);
      const scale = options.fit === "actual" ? zoomFactor : Math.max(0.05, Math.min(5, getPdfAvailableWidth(size.width) / rotatedWidth * zoomFactor));
      const w = Math.floor(rotatedWidth * scale);
      const h = Math.floor(rotatedHeight * scale);
      const wrapper = document.createElement("div");
      wrapper.className = "ofv-pdf-page-wrapper";
      wrapper.setAttribute("data-page-index", String(i));
      wrapper.style.width = `${w}px`;
      wrapper.style.height = `${h}px`;
      wrapper.append(createPageStatus("ofv-pdf-skeleton", `\u9875\u9762 ${i + 1} \u52A0\u8F7D\u4E2D...`));
      scroller.appendChild(wrapper);
      pageStates.push({
        wrapper,
        canvas: null,
        renderTask: null,
        rendered: false
      });
      if (observer) {
        observer.observe(wrapper);
      } else {
        void renderPage(i, size);
      }
    }
    if (observer) {
      window.setTimeout(() => {
        const eagerPages = pdfDocument.numPages > 8 ? 2 : pdfDocument.numPages;
        for (let i = 0; i < eagerPages; i++) {
          void renderPage(i, size);
        }
      }, 0);
    }
  };
  renderLayout(options.size);
  let resizeTimer;
  return {
    canCommand(command) {
      return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset" || command === "rotate-right" || command === "rotate-left";
    },
    command(command) {
      if (command === "zoom-in") {
        zoomFactor = Math.min(4, zoomFactor + 0.15);
        renderLayout(currentSize);
        return true;
      }
      if (command === "zoom-out") {
        zoomFactor = Math.max(0.25, zoomFactor - 0.15);
        renderLayout(currentSize);
        return true;
      }
      if (command === "zoom-reset") {
        zoomFactor = 1;
        rotation = 0;
        renderLayout(currentSize);
        return true;
      }
      if (command === "rotate-right" || command === "rotate-left") {
        rotation = normalizePdfRotation(rotation + (command === "rotate-right" ? 90 : -90));
        renderLayout(currentSize);
        return true;
      }
      return false;
    },
    resize(size) {
      currentSize = size;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        renderLayout(size);
      }, 120);
    },
    destroy() {
      options.toolbar?.setZoom(void 0);
      window.clearTimeout(resizeTimer);
      observer?.disconnect();
      pageStates.forEach((state) => {
        if (state.renderTask) {
          try {
            state.renderTask.cancel();
          } catch (e) {
          }
        }
      });
      pageStates.length = 0;
      destroyPdfResource(pdfDocument);
      destroyPdfResource(documentTask);
      if (options.revokeUrlOnDestroy) {
        revokeObjectUrl(options.fileUrl, Boolean(options.isExternal));
      }
    }
  };
}
function destroyPdfResource(resource) {
  if (!resource || typeof resource !== "object") {
    return;
  }
  const candidate = resource;
  if (typeof candidate.destroy === "function") {
    void candidate.destroy();
    return;
  }
  if (typeof candidate.cleanup === "function") {
    void candidate.cleanup();
  }
}
function getPdfOutputScale() {
  if (typeof window === "undefined") {
    return 1;
  }
  return Math.max(1, Math.min(window.devicePixelRatio || 1, 2.5));
}
function getPdfAvailableWidth(width) {
  if (!Number.isFinite(width) || width <= 0) {
    return 1;
  }
  const gutter = width < 160 ? 16 : 32;
  return Math.max(1, width - gutter);
}
function renderPdfSummary(summary, pages, pagesMeta, fit, zoomFactor) {
  summary.replaceChildren();
  appendPdfSummary(summary, "\u9875\u6570", String(pages));
  const pageSizes = formatPdfPageSizes(pagesMeta);
  if (pageSizes) {
    appendPdfSummary(summary, "\u9875\u9762\u5C3A\u5BF8", pageSizes);
  }
  appendPdfSummary(summary, "\u9002\u914D", fit === "actual" ? "\u539F\u59CB\u5927\u5C0F" : "\u9002\u5408\u5BBD\u5EA6");
  appendPdfSummary(summary, "\u7F29\u653E", `${Math.round(zoomFactor * 100)}%`);
}
function appendPdfSummary(parent, label, value) {
  const item = document.createElement("span");
  const key = document.createElement("span");
  key.textContent = label;
  const content = document.createElement("strong");
  content.textContent = value;
  item.append(key, content);
  parent.append(item);
}
function normalizePdfRotation(value) {
  return (value % 360 + 360) % 360;
}
function isPdfRotatedSideways(rotation) {
  const normalized = normalizePdfRotation(rotation);
  return normalized === 90 || normalized === 270;
}
function rotatedPdfWidth(meta, rotation) {
  return isPdfRotatedSideways(rotation) ? meta.height : meta.width;
}
function rotatedPdfHeight(meta, rotation) {
  return isPdfRotatedSideways(rotation) ? meta.width : meta.height;
}
function formatPdfPageSizes(pagesMeta) {
  const counts = /* @__PURE__ */ new Map();
  for (const page of pagesMeta) {
    const key = `${Math.round(page.width)} x ${Math.round(page.height)}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([size, count]) => count > 1 ? `${size} (${count})` : size).join(", ");
}
function normalizePdfOptions(options) {
  if ("getDocument" in options) {
    return { pdfjs: options };
  }
  return options;
}
async function loadPdfData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load PDF data: ${response.status} ${response.statusText}`);
  }
  return new Uint8Array(await response.arrayBuffer());
}
function isCanvasVisuallyBlank(canvas, context) {
  if (canvas.width === 0 || canvas.height === 0 || typeof context.getImageData !== "function") {
    return false;
  }
  try {
    const sampleWidth = Math.min(canvas.width, 96);
    const sampleHeight = Math.min(canvas.height, 96);
    const stepX = Math.max(1, Math.floor(canvas.width / sampleWidth));
    const stepY = Math.max(1, Math.floor(canvas.height / sampleHeight));
    let sampled = 0;
    let nonBlank = 0;
    for (let y = 0; y < canvas.height; y += stepY) {
      for (let x = 0; x < canvas.width; x += stepX) {
        const pixel = context.getImageData(x, y, 1, 1).data;
        const red = pixel[0];
        const green = pixel[1];
        const blue = pixel[2];
        const alpha = pixel[3];
        sampled += 1;
        if (alpha > 8 && (red < 248 || green < 248 || blue < 248)) {
          nonBlank += 1;
          if (nonBlank / sampled > 2e-3) {
            return false;
          }
        }
      }
    }
    return sampled > 0;
  } catch {
    return false;
  }
}
function createPageStatus(className, text) {
  const status = document.createElement("div");
  status.className = className;
  status.textContent = text;
  return status;
}
function createPdfFallback(fileName, url, message, titleText = "PDF \u9884\u89C8\u5931\u8D25") {
  const fallback = document.createElement("div");
  fallback.className = "ofv-fallback";
  const title = document.createElement("strong");
  title.textContent = titleText;
  const meta = document.createElement("span");
  meta.textContent = `${message} ${fileName}`;
  const download = document.createElement("a");
  download.href = url;
  download.download = fileName;
  download.textContent = "\u4E0B\u8F7D PDF";
  fallback.append(title, meta, download);
  return fallback;
}
function normalizePdfError(error) {
  const message = error instanceof Error ? error.message : String(error || "");
  const name = typeof error === "object" && error !== null && "name" in error ? String(error.name) : "";
  const lower = `${name} ${message}`.toLowerCase();
  if (lower.includes("invalid") || lower.includes("missing") || lower.includes("corrupt")) {
    return "\u8BE5 PDF \u6587\u4EF6\u53EF\u80FD\u5DF2\u635F\u574F\u6216\u683C\u5F0F\u65E0\u6548\u3002";
  }
  return "\u5F53\u524D\u6D4F\u89C8\u5668\u65E0\u6CD5\u52A0\u8F7D\u8BE5 PDF\u3002";
}
function configurePdfWorker(pdf, workerSrc) {
  if (workerSrc) {
    pdf.GlobalWorkerOptions.workerSrc = workerSrc;
    return;
  }
  if (!pdf.GlobalWorkerOptions.workerSrc && typeof window !== "undefined") {
    pdf.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdf.version}/build/pdf.worker.mjs`;
  }
}

// src/plugins/epub.ts
import JSZip from "jszip";
import DOMPurify from "dompurify";
var epubMimeTypes = /* @__PURE__ */ new Set(["application/epub+zip", "application/x-epub+zip"]);
function epubPlugin() {
  return {
    name: "epub",
    match(file) {
      return file.extension === "epub" || epubMimeTypes.has(file.mimeType);
    },
    async render(ctx) {
      const panel = createPanel("ofv-epub");
      ctx.viewport.append(panel);
      try {
        const zip = await JSZip.loadAsync(await readArrayBuffer(ctx.file));
        await renderEpub(panel, zip);
      } catch (error) {
        renderEpubFallback(panel, error);
      }
      const controller = createEpubReaderController(panel, ctx);
      return {
        canCommand(command) {
          return controller?.canCommand(command) ?? false;
        },
        command(command) {
          return controller?.command(command) ?? false;
        },
        destroy() {
          controller?.destroy();
          panel.remove();
        }
      };
    }
  };
}
function createEpubReaderController(panel, ctx) {
  const reader = panel.querySelector(".ofv-epub-reader");
  if (!reader) {
    return void 0;
  }
  let zoom = 1;
  const apply = () => {
    reader.style.setProperty("--ofv-epub-zoom", String(zoom));
    ctx.toolbar?.setZoom(zoom);
  };
  apply();
  return {
    canCommand(command) {
      return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset";
    },
    command(command) {
      if (command === "zoom-in") {
        zoom = Math.min(2.5, Number((zoom + 0.12).toFixed(2)));
        apply();
        return true;
      }
      if (command === "zoom-out") {
        zoom = Math.max(0.6, Number((zoom - 0.12).toFixed(2)));
        apply();
        return true;
      }
      if (command === "zoom-reset") {
        zoom = 1;
        apply();
        return true;
      }
      return false;
    },
    destroy() {
      ctx.toolbar?.setZoom(void 0);
    }
  };
}
async function renderEpub(panel, zip) {
  const opfPath = await resolvePackagePath(zip);
  const opfText = await zip.file(opfPath)?.async("text");
  if (!opfText) {
    throw new Error("EPUB \u7F3A\u5C11 OPF package \u6587\u4EF6\u3002");
  }
  const opf = parseXml(opfText, "EPUB package \u6587\u4EF6\u89E3\u6790\u5931\u8D25\u3002");
  const basePath = directoryName(opfPath);
  const manifest = readManifest(opf);
  const spine = readSpine(opf, manifest);
  const metadata = readMetadata(opf);
  const structure = summarizeEpubStructure(opf, manifest, spine);
  const assets = await readEpubAssets(zip, basePath, manifest);
  const summary = createSection("EPUB \u56FE\u4E66\u4FE1\u606F");
  summary.hidden = spine.length > 0;
  if (spine.length > 0) {
    summary.setAttribute("aria-hidden", "true");
    summary.style.display = "none";
  }
  const meta = document.createElement("div");
  meta.className = "ofv-epub-meta";
  meta.hidden = spine.length > 0;
  if (spine.length > 0) {
    meta.setAttribute("aria-hidden", "true");
    meta.style.display = "none";
  }
  appendMeta2(meta, "\u6807\u9898", metadata.title || "\u672A\u547D\u540D EPUB");
  appendMeta2(meta, "\u4F5C\u8005", metadata.creator || "\u672A\u77E5");
  appendMeta2(meta, "\u8BED\u8A00", metadata.language || "\u672A\u58F0\u660E");
  if (metadata.publisher) {
    appendMeta2(meta, "\u51FA\u7248\u65B9", metadata.publisher);
  }
  if (metadata.identifier) {
    appendMeta2(meta, "\u6807\u8BC6", metadata.identifier);
  }
  if (metadata.modified) {
    appendMeta2(meta, "\u4FEE\u6539\u65F6\u95F4", metadata.modified);
  }
  appendMeta2(meta, "\u7AE0\u8282", spine.length || "\u672A\u89E3\u6790\u5230\u9605\u8BFB\u987A\u5E8F");
  appendMeta2(meta, "Manifest", structure.manifestItems);
  appendMeta2(meta, "Spine", structure.spineItems);
  appendMeta2(meta, "\u5BFC\u822A", structure.navItems + structure.tocItems);
  appendMeta2(meta, "\u5C01\u9762", structure.coverItems);
  appendMeta2(meta, "\u56FE\u7247", structure.images);
  appendMeta2(meta, "\u6837\u5F0F", structure.styles);
  appendMeta2(meta, "\u5B57\u4F53", structure.fonts);
  if (structure.audio || structure.video) {
    appendMeta2(meta, "\u97F3\u89C6\u9891", `${structure.audio} / ${structure.video}`);
  }
  if (structure.otherItems) {
    appendMeta2(meta, "\u5176\u4ED6\u8D44\u6E90", structure.otherItems);
  }
  if (structure.missingSpineItems) {
    appendMeta2(meta, "\u7F3A\u5931\u7AE0\u8282\u5F15\u7528", structure.missingSpineItems);
  }
  summary.append(meta);
  panel.append(summary);
  const chapters = createSection("EPUB \u6B63\u6587\u9884\u89C8");
  if (spine.length > 0) {
    hideSupplementalInfo(chapters.querySelector("h3"));
  }
  const article = document.createElement("article");
  article.className = "ofv-epub-reader";
  if (spine.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "\u672A\u89E3\u6790\u5230\u53EF\u5C55\u793A\u7AE0\u8282\u3002";
    article.append(empty);
  } else {
    for (const [index, item] of spine.slice(0, 40).entries()) {
      const chapterPath = joinZipPath(basePath, item.href);
      const chapterText = await zip.file(chapterPath)?.async("text");
      if (!chapterText) {
        continue;
      }
      const section = document.createElement("section");
      section.className = "ofv-epub-chapter";
      const heading = document.createElement("h3");
      heading.textContent = chapterTitle(chapterText) || `\u7AE0\u8282 ${index + 1}`;
      const content = document.createElement("div");
      content.className = "ofv-epub-content";
      content.innerHTML = sanitizeChapterHtml(rewriteAssetReferences(chapterText, assets, directoryName(chapterPath)));
      section.append(heading, content);
      article.append(section);
    }
  }
  chapters.append(article);
  panel.append(chapters);
}
async function resolvePackagePath(zip) {
  const containerXml = await zip.file("META-INF/container.xml")?.async("text");
  if (containerXml) {
    const container = parseXml(containerXml, "EPUB container.xml \u89E3\u6790\u5931\u8D25\u3002");
    const rootfile = Array.from(container.getElementsByTagName("*")).find(
      (element) => element.localName === "rootfile" && getXmlAttribute(element, "full-path")
    );
    const fullPath = rootfile ? getXmlAttribute(rootfile, "full-path") : null;
    if (fullPath && zip.file(fullPath)) {
      return fullPath;
    }
  }
  const fallback = Object.values(zip.files).find((entry) => !entry.dir && entry.name.endsWith(".opf"));
  if (!fallback) {
    throw new Error("EPUB \u672A\u627E\u5230 package OPF \u6587\u4EF6\u3002");
  }
  return fallback.name;
}
function readManifest(opf) {
  const manifest = /* @__PURE__ */ new Map();
  for (const item of Array.from(opf.getElementsByTagName("*")).filter((element) => element.localName === "item")) {
    const id = getXmlAttribute(item, "id");
    const href = getXmlAttribute(item, "href");
    if (!id || !href) {
      continue;
    }
    manifest.set(id, {
      id,
      href,
      mediaType: getXmlAttribute(item, "media-type") || "",
      properties: getXmlAttribute(item, "properties") || ""
    });
  }
  return manifest;
}
function readSpine(opf, manifest) {
  const items = [];
  for (const itemref of Array.from(opf.getElementsByTagName("*")).filter((element) => element.localName === "itemref")) {
    const idref = getXmlAttribute(itemref, "idref");
    const item = idref ? manifest.get(idref) : void 0;
    if (item && isChapterMediaType(item.mediaType)) {
      items.push(item);
    }
  }
  if (items.length > 0) {
    return items;
  }
  return Array.from(manifest.values()).filter((item) => isChapterMediaType(item.mediaType));
}
function readMetadata(opf) {
  return {
    title: textByLocalName(opf, "title"),
    creator: textByLocalName(opf, "creator"),
    language: textByLocalName(opf, "language"),
    identifier: textByLocalName(opf, "identifier"),
    publisher: textByLocalName(opf, "publisher"),
    modified: metaPropertyText(opf, "dcterms:modified")
  };
}
function summarizeEpubStructure(opf, manifest, spine) {
  const items = Array.from(manifest.values());
  const chapters = spine.length;
  const images = items.filter((item) => item.mediaType.startsWith("image/")).length;
  const styles = items.filter((item) => item.mediaType === "text/css").length;
  const fonts = items.filter((item) => item.mediaType.startsWith("font/") || /font|opentype|truetype/i.test(item.mediaType)).length;
  const audio = items.filter((item) => item.mediaType.startsWith("audio/")).length;
  const video = items.filter((item) => item.mediaType.startsWith("video/")).length;
  const navItems = items.filter((item) => propertyTokens(item.properties).has("nav")).length;
  const tocItems = items.filter((item) => item.mediaType === "application/x-dtbncx+xml" || propertyTokens(item.properties).has("toc")).length;
  const coverItems = items.filter((item) => item.id.toLowerCase().includes("cover") || propertyTokens(item.properties).has("cover-image")).length;
  const otherItems = items.filter((item) => !isKnownEpubResource(item)).length;
  return {
    manifestItems: items.length,
    spineItems: spine.length,
    chapters,
    images,
    styles,
    fonts,
    audio,
    video,
    navItems,
    tocItems,
    coverItems,
    otherItems,
    missingSpineItems: Math.max(0, readSpineRefCount(opf) - spine.length)
  };
}
function isKnownEpubResource(item) {
  const properties = propertyTokens(item.properties);
  return isChapterMediaType(item.mediaType) || item.mediaType.startsWith("image/") || item.mediaType === "text/css" || item.mediaType.startsWith("font/") || /font|opentype|truetype/i.test(item.mediaType) || item.mediaType.startsWith("audio/") || item.mediaType.startsWith("video/") || item.mediaType === "application/x-dtbncx+xml" || properties.has("nav") || properties.has("toc");
}
async function readEpubAssets(zip, basePath, manifest) {
  const assets = /* @__PURE__ */ new Map();
  for (const item of manifest.values()) {
    if (!item.mediaType.startsWith("image/")) {
      continue;
    }
    const path = joinZipPath(basePath, item.href);
    const entry = zip.file(path);
    if (!entry) {
      continue;
    }
    assets.set(path, `data:${item.mediaType};base64,${await entry.async("base64")}`);
  }
  return assets;
}
function rewriteAssetReferences(html, assets, chapterDir) {
  const documentHtml = new DOMParser().parseFromString(html, "text/html");
  for (const image of Array.from(documentHtml.querySelectorAll("img[src], image[href], image[xlink\\:href]"))) {
    const raw = image.getAttribute("src") || image.getAttribute("href") || image.getAttribute("xlink:href") || "";
    const path = joinZipPath(chapterDir, raw.split("#")[0] || raw);
    const src = assets.get(path);
    if (!src) {
      continue;
    }
    image.setAttribute("src", src);
    image.setAttribute("href", src);
    image.setAttribute("xlink:href", src);
  }
  return documentHtml.body.innerHTML;
}
function sanitizeChapterHtml(html) {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true, svg: true, svgFilters: false },
    ADD_ATTR: ["target", "xlink:href"]
  });
}
function chapterTitle(html) {
  const documentHtml = new DOMParser().parseFromString(html, "text/html");
  const heading = documentHtml.querySelector("h1, h2, h3, title");
  return heading?.textContent?.trim() || "";
}
function renderEpubFallback(panel, error) {
  panel.replaceChildren();
  const fallback = document.createElement("div");
  fallback.className = "ofv-fallback";
  const title = document.createElement("strong");
  title.textContent = "EPUB \u89E3\u6790\u5931\u8D25";
  const meta = document.createElement("span");
  meta.textContent = error instanceof Error ? error.message : "\u6587\u4EF6\u53EF\u80FD\u5DF2\u635F\u574F\uFF0C\u6216\u4E0D\u662F\u6709\u6548\u7684 EPUB\u3002";
  fallback.append(title, meta);
  panel.append(fallback);
}
function parseXml(xml, message) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    throw new Error(message);
  }
  return doc;
}
function appendMeta2(parent, label, value) {
  const row = document.createElement("div");
  row.className = "ofv-meta-row";
  const key = document.createElement("span");
  key.textContent = label;
  const content = document.createElement("strong");
  content.textContent = String(value);
  row.append(key, content);
  parent.append(row);
}
function textByLocalName(doc, localName) {
  return Array.from(doc.getElementsByTagName("*")).find((element) => element.localName === localName)?.textContent?.trim() || "";
}
function metaPropertyText(doc, property) {
  return Array.from(doc.getElementsByTagName("*")).find((element) => element.localName === "meta" && getXmlAttribute(element, "property") === property)?.textContent?.trim() || "";
}
function propertyTokens(value) {
  return new Set(value.split(/\s+/).map((item) => item.trim()).filter(Boolean));
}
function readSpineRefCount(opf) {
  return Array.from(opf.getElementsByTagName("*")).filter((element) => element.localName === "itemref").length;
}
function getXmlAttribute(element, localName) {
  const direct = element.getAttribute(localName);
  if (direct !== null) {
    return direct;
  }
  for (const attribute of Array.from(element.attributes)) {
    if (attribute.localName === localName) {
      return attribute.value;
    }
  }
  return null;
}
function hideSupplementalInfo(element) {
  if (!element) {
    return;
  }
  element.hidden = true;
  element.setAttribute("aria-hidden", "true");
  element.style.display = "none";
}
function isChapterMediaType(mediaType) {
  return mediaType === "application/xhtml+xml" || mediaType === "text/html" || mediaType === "application/xml";
}
function directoryName(path) {
  const index = path.lastIndexOf("/");
  return index >= 0 ? path.slice(0, index + 1) : "";
}
function joinZipPath(basePath, path) {
  const parts = `${basePath}${path}`.split("/");
  const normalized = [];
  for (const part of parts) {
    if (!part || part === ".") {
      continue;
    }
    if (part === "..") {
      normalized.pop();
    } else {
      normalized.push(part);
    }
  }
  return normalized.join("/");
}

// src/plugins/xps.ts
import JSZip2 from "jszip";
var xpsMimeTypes = /* @__PURE__ */ new Set([
  "application/oxps",
  "application/vnd.ms-xpsdocument"
]);
function xpsPlugin() {
  return {
    name: "xps",
    match(file) {
      return file.extension === "xps" || file.extension === "oxps" || xpsMimeTypes.has(file.mimeType);
    },
    async render(ctx) {
      const panel = createPanel("ofv-xps");
      ctx.viewport.append(panel);
      try {
        const zip = await JSZip2.loadAsync(await readArrayBuffer(ctx.file));
        await renderXps(panel, zip);
      } catch (error) {
        renderXpsFallback(panel, error);
      }
      const controller = createXpsCanvasController(panel, ctx);
      return {
        canCommand(command) {
          return controller?.canCommand(command) ?? false;
        },
        command(command) {
          return controller?.command(command) ?? false;
        },
        destroy() {
          controller?.destroy();
          panel.remove();
        }
      };
    }
  };
}
function createXpsCanvasController(panel, ctx) {
  const canvases = Array.from(panel.querySelectorAll(".ofv-xps-canvas")).map((svg) => ({ svg, initialViewBox: parseSvgViewBox(svg) })).filter((item) => Boolean(item.initialViewBox));
  if (canvases.length === 0) {
    return void 0;
  }
  let zoom = 1;
  let rotation = 0;
  const apply = () => {
    for (const { svg, initialViewBox } of canvases) {
      const width = initialViewBox.width / zoom;
      const height = initialViewBox.height / zoom;
      const x = initialViewBox.x + (initialViewBox.width - width) / 2;
      const y = initialViewBox.y + (initialViewBox.height - height) / 2;
      svg.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
      svg.style.transformOrigin = "center center";
      svg.style.transform = rotation === 0 ? "" : `rotate(${rotation}deg)`;
    }
    ctx.toolbar?.setZoom(zoom);
  };
  apply();
  return {
    canCommand(command) {
      return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset" || command === "rotate-right" || command === "rotate-left";
    },
    command(command) {
      if (command === "zoom-in") {
        zoom = Math.min(8, zoom * 1.18);
        apply();
        return true;
      }
      if (command === "zoom-out") {
        zoom = Math.max(0.25, zoom / 1.18);
        apply();
        return true;
      }
      if (command === "zoom-reset") {
        zoom = 1;
        rotation = 0;
        apply();
        return true;
      }
      if (command === "rotate-right" || command === "rotate-left") {
        rotation += command === "rotate-right" ? 90 : -90;
        apply();
        return true;
      }
      return false;
    },
    destroy() {
      ctx.toolbar?.setZoom(void 0);
    }
  };
}
function parseSvgViewBox(svg) {
  const parts = svg.getAttribute("viewBox")?.trim().split(/[\s,]+/).map(Number);
  if (!parts || parts.length !== 4 || parts.some((part) => !Number.isFinite(part)) || parts[2] <= 0 || parts[3] <= 0) {
    return void 0;
  }
  return { x: parts[0], y: parts[1], width: parts[2], height: parts[3] };
}
async function renderXps(panel, zip) {
  const entries = Object.values(zip.files).filter((entry) => !entry.dir);
  const fixedPages = entries.filter((entry) => /(?:^|\/)Pages\/[^/]+\.fpage$/i.test(entry.name) || entry.name.endsWith(".fpage")).sort((a, b) => a.name.localeCompare(b.name, void 0, { numeric: true }));
  const resourceEntries = entries.filter((entry) => /\.(?:png|jpe?g|tiff?|wdp|bmp|gif|odttf|ttf)$/i.test(entry.name));
  const pagePreviews = await Promise.all(
    fixedPages.slice(0, 80).map(async (entry, index) => {
      const xml = await entry.async("text");
      return {
        entry,
        index,
        xml,
        info: parseXpsPageInfo(xml)
      };
    })
  );
  const summary = createSection("XPS \u7248\u5F0F\u9884\u89C8");
  summary.hidden = fixedPages.length > 0;
  if (fixedPages.length > 0) {
    summary.setAttribute("aria-hidden", "true");
    summary.style.display = "none";
  }
  const note = document.createElement("p");
  note.textContent = "\u5F53\u524D\u7248\u672C\u4F1A\u5728\u524D\u7AEF\u89E3\u6790 XPS/OXPS \u5305\u5185 FixedPage \u6587\u672C\u3001\u8DEF\u5F84\u548C\u8D44\u6E90\u7ED3\u6784\uFF0C\u5E76\u751F\u6210\u8F7B\u91CF SVG \u9875\u9762\u9884\u89C8\uFF1B\u590D\u6742\u753B\u5237\u3001\u5B57\u4F53\u5B50\u96C6\u548C\u900F\u660E\u6DF7\u5408\u53EF\u63A5\u5165\u4E13\u7528\u6E32\u67D3\u5668\u589E\u5F3A\u3002";
  summary.append(note);
  summary.append(createXpsSummary(entries, fixedPages, resourceEntries, pagePreviews.map((page) => page.info)));
  panel.append(summary);
  const pages = createSection(`\u9875\u9762\u6587\u672C ${fixedPages.length}`);
  if (fixedPages.length > 0) {
    hideSupplementalInfo2(pages.querySelector("h3"));
  }
  const reader = document.createElement("div");
  reader.className = "ofv-xps-pages";
  if (fixedPages.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "\u672A\u89E3\u6790\u5230 FixedPage \u9875\u9762\u3002";
    reader.append(empty);
  } else {
    for (const page of pagePreviews) {
      reader.append(renderXpsPage(page.xml, page.entry.name, page.index));
    }
  }
  pages.append(reader);
  if (fixedPages.length > 0 && reader.querySelector(".ofv-xps-canvas")) {
    for (const textLayer of reader.querySelectorAll(".ofv-xps-text")) {
      hideSupplementalInfo2(textLayer);
    }
  }
  panel.append(pages);
  const structure = createSection(`\u6587\u4EF6\u7ED3\u6784 ${entries.length}`);
  structure.hidden = fixedPages.length > 0;
  if (fixedPages.length > 0) {
    structure.setAttribute("aria-hidden", "true");
    structure.style.display = "none";
  }
  const list = document.createElement("ul");
  for (const entry of entries.slice(0, 240)) {
    const item = document.createElement("li");
    item.textContent = entry.name;
    list.append(item);
  }
  structure.append(list);
  panel.append(structure);
}
function createXpsSummary(entries, fixedPages, resourceEntries, pageInfos) {
  const meta = document.createElement("div");
  meta.className = "ofv-xps-meta ofv-xps-summary";
  meta.hidden = fixedPages.length > 0;
  if (fixedPages.length > 0) {
    meta.setAttribute("aria-hidden", "true");
    meta.style.display = "none";
  }
  appendMeta3(meta, "\u9875\u9762", fixedPages.length);
  appendMeta3(meta, "\u6587\u4EF6", entries.length);
  appendMeta3(meta, "FixedDocument", entries.filter((entry) => /\.fdoc$/i.test(entry.name)).length);
  appendMeta3(meta, "FixedDocSeq", entries.filter((entry) => /\.fdseq$/i.test(entry.name)).length);
  appendMeta3(meta, "\u5173\u7CFB\u6587\u4EF6", entries.filter((entry) => /(?:^|\/)_rels\/[^/]+\.rels$/i.test(entry.name) || entry.name.endsWith(".rels")).length);
  appendMeta3(meta, "\u8D44\u6E90", resourceEntries.length);
  appendMeta3(meta, "\u56FE\u7247\u8D44\u6E90", resourceEntries.filter((entry) => /\.(?:png|jpe?g|tiff?|wdp|bmp|gif)$/i.test(entry.name)).length);
  appendMeta3(meta, "\u5B57\u4F53\u8D44\u6E90", resourceEntries.filter((entry) => /\.(?:odttf|ttf)$/i.test(entry.name)).length);
  const glyphs = pageInfos.reduce((count, page) => count + page.glyphs, 0);
  appendMeta3(meta, "Glyphs", glyphs);
  const pageSizes = formatXpsPageSizes(pageInfos);
  if (pageSizes) {
    appendMeta3(meta, "\u9875\u9762\u5C3A\u5BF8", pageSizes);
  }
  const pageObjects = formatXpsPageObjects(pageInfos);
  if (pageObjects) {
    appendMeta3(meta, "\u9875\u9762\u5BF9\u8C61", pageObjects);
  }
  return meta;
}
function parseXpsPageInfo(xml) {
  const fallback = parseXpsPageInfoByRegex(xml);
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    return fallback;
  }
  const root = doc.documentElement;
  const elements = Array.from(doc.getElementsByTagName("*"));
  return {
    width: finiteNumber(getXmlAttribute2(root, "Width"), fallback.width),
    height: finiteNumber(getXmlAttribute2(root, "Height"), fallback.height),
    glyphs: elements.filter((element) => element.localName === "Glyphs").length,
    imageBrushes: elements.filter((element) => element.localName === "ImageBrush").length,
    canvases: elements.filter((element) => element.localName === "Canvas").length,
    paths: elements.filter((element) => element.localName === "Path").length
  };
}
function parseXpsPageInfoByRegex(xml) {
  return {
    width: finiteNumber(firstAttributeValue(xml, "Width"), void 0),
    height: finiteNumber(firstAttributeValue(xml, "Height"), void 0),
    glyphs: countMatches2(xml, /<[\w:.-]*Glyphs\b/g),
    imageBrushes: countMatches2(xml, /<[\w:.-]*ImageBrush\b/g),
    canvases: countMatches2(xml, /<[\w:.-]*Canvas\b/g),
    paths: countMatches2(xml, /<[\w:.-]*Path\b/g)
  };
}
function formatXpsPageSizes(pageInfos) {
  const counts = /* @__PURE__ */ new Map();
  for (const page of pageInfos) {
    if (!Number.isFinite(page.width) || !Number.isFinite(page.height)) {
      continue;
    }
    const key = `${Math.round(page.width)} x ${Math.round(page.height)}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([size, count]) => count > 1 ? `${size} (${count})` : size).join(", ");
}
function formatXpsPageObjects(pageInfos) {
  const totals = pageInfos.reduce(
    (result, page) => ({
      imageBrushes: result.imageBrushes + page.imageBrushes,
      canvases: result.canvases + page.canvases,
      paths: result.paths + page.paths
    }),
    { imageBrushes: 0, canvases: 0, paths: 0 }
  );
  return [
    totals.imageBrushes ? `ImageBrush ${totals.imageBrushes}` : "",
    totals.canvases ? `Canvas ${totals.canvases}` : "",
    totals.paths ? `Path ${totals.paths}` : ""
  ].filter(Boolean).join(", ");
}
function renderXpsPage(xml, path, index) {
  const page = document.createElement("article");
  page.className = "ofv-xps-page";
  const heading = document.createElement("h4");
  heading.textContent = `Page ${index + 1}`;
  const pathMeta = document.createElement("span");
  pathMeta.textContent = path;
  hideSupplementalInfo2(pathMeta);
  const canvas = createXpsPageCanvas(xml);
  const text = document.createElement("div");
  text.className = "ofv-xps-text";
  const fragments = extractXpsText(xml);
  if (fragments.length > 0) {
    for (const fragment of fragments) {
      const paragraph = document.createElement("p");
      paragraph.textContent = fragment;
      text.append(paragraph);
    }
  } else {
    const empty = document.createElement("p");
    empty.textContent = "\u8FD9\u4E00\u9875\u672A\u63D0\u53D6\u5230 Glyphs \u6587\u672C\u3002";
    text.append(empty);
  }
  page.append(heading, pathMeta);
  if (canvas) {
    hideSupplementalInfo2(heading);
    page.append(canvas);
  }
  page.append(text);
  return page;
}
function createXpsPageCanvas(xml) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    return null;
  }
  const info = parseXpsPageInfo(xml);
  const width = info.width || 816;
  const height = info.height || 1056;
  const elements = Array.from(doc.getElementsByTagName("*"));
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("ofv-xps-canvas");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "XPS page layout preview");
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("x", "0");
  background.setAttribute("y", "0");
  background.setAttribute("width", String(width));
  background.setAttribute("height", String(height));
  background.setAttribute("fill", "#ffffff");
  svg.append(background);
  let drawn = 0;
  for (const element of elements) {
    if (element.localName === "Path") {
      const pathData = getXmlAttribute2(element, "Data");
      if (pathData) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("fill", parseXpsBrush(getXmlAttribute2(element, "Fill"), "none"));
        path.setAttribute("stroke", parseXpsBrush(getXmlAttribute2(element, "Stroke"), "#334155"));
        path.setAttribute("stroke-width", getXmlAttribute2(element, "StrokeThickness") || "1");
        path.setAttribute("vector-effect", "non-scaling-stroke");
        svg.append(path);
        drawn++;
      }
    } else if (element.localName === "Glyphs") {
      const label = getXmlAttribute2(element, "UnicodeString");
      if (label) {
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.textContent = label;
        text.setAttribute("x", String(finiteNumber(getXmlAttribute2(element, "OriginX"), 24) || 24));
        text.setAttribute("y", String(finiteNumber(getXmlAttribute2(element, "OriginY"), 36) || 36));
        text.setAttribute("fill", parseXpsBrush(getXmlAttribute2(element, "Fill"), "#111827"));
        text.setAttribute("font-size", String(finiteNumber(getXmlAttribute2(element, "FontRenderingEmSize"), 16) || 16));
        text.setAttribute("font-family", "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif");
        svg.append(text);
        drawn++;
      }
    }
  }
  return drawn > 0 ? svg : null;
}
function parseXpsBrush(value, fallback) {
  if (!value) {
    return fallback;
  }
  const normalized = value.trim();
  if (/^#[0-9a-f]{6,8}$/i.test(normalized)) {
    return normalized.length === 9 ? `#${normalized.slice(3)}` : normalized;
  }
  if (/^[a-z]+$/i.test(normalized)) {
    return normalized;
  }
  return fallback;
}
function extractXpsText(xml) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    return extractXpsTextByRegex(xml);
  }
  return Array.from(doc.getElementsByTagName("*")).filter((element) => element.localName === "Glyphs").map((glyph) => getXmlAttribute2(glyph, "UnicodeString") || "").map((value) => value.replace(/\s+/g, " ").trim()).filter(Boolean);
}
function extractXpsTextByRegex(xml) {
  return [...xml.matchAll(/\bUnicodeString=(?:"([^"]*)"|'([^']*)')/g)].map((match) => decodeXml(match[1] || match[2] || "")).map((value) => value.replace(/\s+/g, " ").trim()).filter(Boolean);
}
function firstAttributeValue(xml, name) {
  const match = xml.match(new RegExp(`\\b${name}=(?:"([^"]*)"|'([^']*)')`));
  return match?.[1] || match?.[2];
}
function countMatches2(value, pattern) {
  return [...value.matchAll(pattern)].length;
}
function renderXpsFallback(panel, error) {
  panel.replaceChildren();
  const fallback = document.createElement("div");
  fallback.className = "ofv-fallback";
  const title = document.createElement("strong");
  title.textContent = "XPS \u89E3\u6790\u5931\u8D25";
  const meta = document.createElement("span");
  meta.textContent = error instanceof Error ? error.message : "\u6587\u4EF6\u53EF\u80FD\u5DF2\u635F\u574F\uFF0C\u6216\u4E0D\u662F\u6709\u6548\u7684 XPS/OXPS \u5305\u3002";
  fallback.append(title, meta);
  panel.append(fallback);
}
function appendMeta3(parent, label, value) {
  const row = document.createElement("div");
  row.className = "ofv-meta-row";
  const key = document.createElement("span");
  key.textContent = label;
  const content = document.createElement("strong");
  content.textContent = String(value);
  row.append(key, content);
  parent.append(row);
}
function hideSupplementalInfo2(element) {
  if (!element) {
    return;
  }
  element.hidden = true;
  element.setAttribute("aria-hidden", "true");
  element.style.display = "none";
}
function getXmlAttribute2(element, localName) {
  const direct = element.getAttribute(localName);
  if (direct !== null) {
    return direct;
  }
  for (const attribute of Array.from(element.attributes)) {
    if (attribute.localName === localName) {
      return attribute.value;
    }
  }
  return null;
}
function finiteNumber(value, fallback) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
function decodeXml(value) {
  return value.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&apos;", "'");
}

// src/plugins/office.ts
import JSZip3 from "jszip";
import DOMPurify2 from "dompurify";
var wordExtensions = /* @__PURE__ */ new Set(["docx", "docm", "doc", "dotx", "dotm", "dot", "rtf", "odt", "fodt", "wps"]);
var sheetExtensions = /* @__PURE__ */ new Set(["xlsx", "xls", "xlsm", "xlsb", "xlt", "xltx", "xltm", "csv", "tsv", "ods", "fods", "numbers", "et"]);
var presentationExtensions = /* @__PURE__ */ new Set(["pptx", "pptm", "ppt", "pps", "ppsx", "ppsm", "potx", "potm", "odp", "fodp", "key", "dps"]);
var packagedOfficeCandidates = /* @__PURE__ */ new Set(["wps", "et", "dps", "numbers", "key"]);
var SHEET_WINDOW_ROWS = 200;
var SHEET_WINDOW_COLUMNS = 80;
var DEFAULT_PPTX_RENDER_TIMEOUT_MS = 12e3;
var PPTX_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships";
var officeMimeTypes = /* @__PURE__ */ new Set([
  "application/msword",
  "application/rtf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-word.document.macroenabled.12",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
  "application/vnd.ms-word.template.macroenabled.12",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.text-flat-xml",
  "application/vnd.ms-works",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
  "application/vnd.ms-excel.sheet.macroenabled.12",
  "application/vnd.ms-excel.sheet.binary.macroenabled.12",
  "application/vnd.ms-excel.template.macroenabled.12",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.spreadsheet-flat-xml",
  "application/vnd.apple.numbers",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint.presentation.macroenabled.12",
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
  "application/vnd.openxmlformats-officedocument.presentationml.template",
  "application/vnd.ms-powerpoint.template.macroenabled.12",
  "application/vnd.oasis.opendocument.presentation",
  "application/vnd.oasis.opendocument.presentation-flat-xml",
  "application/vnd.apple.keynote"
]);
var officeMimeFormatMap = {
  "application/msword": "doc",
  "application/rtf": "rtf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-word.document.macroenabled.12": "docm",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.template": "dotx",
  "application/vnd.ms-word.template.macroenabled.12": "dotm",
  "application/vnd.oasis.opendocument.text": "odt",
  "application/vnd.oasis.opendocument.text-flat-xml": "fodt",
  "application/vnd.ms-works": "wps",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template": "xltx",
  "application/vnd.ms-excel.sheet.macroenabled.12": "xlsm",
  "application/vnd.ms-excel.sheet.binary.macroenabled.12": "xlsb",
  "application/vnd.ms-excel.template.macroenabled.12": "xltm",
  "application/vnd.oasis.opendocument.spreadsheet": "ods",
  "application/vnd.oasis.opendocument.spreadsheet-flat-xml": "fods",
  "application/vnd.apple.numbers": "numbers",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
  "application/vnd.ms-powerpoint.presentation.macroenabled.12": "pptm",
  "application/vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx",
  "application/vnd.ms-powerpoint.slideshow.macroenabled.12": "ppsm",
  "application/vnd.openxmlformats-officedocument.presentationml.template": "potx",
  "application/vnd.ms-powerpoint.template.macroenabled.12": "potm",
  "application/vnd.oasis.opendocument.presentation": "odp",
  "application/vnd.oasis.opendocument.presentation-flat-xml": "fodp",
  "application/vnd.apple.keynote": "key"
};
function officePlugin(options = {}) {
  return {
    name: "office",
    match(file) {
      return wordExtensions.has(file.extension) || sheetExtensions.has(file.extension) || presentationExtensions.has(file.extension) || officeMimeTypes.has(file.mimeType);
    },
    async render(ctx) {
      const panel = createPanel("ofv-office");
      ctx.viewport.append(panel);
      const extension = resolveFormat(ctx.file, officeMimeFormatMap);
      const arrayBuffer = await readArrayBuffer(ctx.file);
      const packageFormat = shouldSniffPackagedOffice(extension) ? await detectPackagedOfficeFormat(arrayBuffer) : void 0;
      let disposeDocxFit;
      let delegatedInstance;
      const conversionContext = await createOfficeConversionContext(ctx, arrayBuffer, extension, packageFormat);
      if (conversionContext && await shouldUseOfficeConversion(options, conversionContext)) {
        delegatedInstance = await renderConvertedOfficePreview(panel, ctx, options, conversionContext);
      } else if (packageFormat === "docx" && !fileIsDocx(extension)) {
        disposeDocxFit = await renderDocx(panel, arrayBuffer);
      } else if (packageFormat === "xlsx" && !sheetExtensions.has(extension)) {
        await renderSheet(panel, arrayBuffer, "xlsx");
      } else if (packageFormat === "pptx" && !["pptx", "pptm", "ppsx", "ppsm", "potx", "potm"].includes(extension)) {
        await renderPptx(panel, arrayBuffer);
      } else if (fileIsDocx(extension)) {
        disposeDocxFit = await renderDocx(panel, arrayBuffer);
      } else if (extension === "rtf") {
        renderPlainDocument(panel, "RTF \u6587\u6863", rtfToText(await readTextFromBuffer(arrayBuffer)));
      } else if (extension === "odt") {
        await renderOdt(panel, arrayBuffer);
      } else if (extension === "fodt") {
        renderOpenDocumentXml(panel, "FODT \u6587\u6863", await readTextFromBuffer(arrayBuffer));
      } else if (extension === "fods") {
        renderFlatOds(panel, await readTextFromBuffer(arrayBuffer));
      } else if (packagedOfficeCandidates.has(extension) && await renderPackagedOfficePreview(panel, arrayBuffer, extension)) {
      } else if (sheetExtensions.has(extension)) {
        await renderSheet(panel, arrayBuffer, extension);
      } else if (["pptx", "pptm", "ppsx", "ppsm", "potx", "potm"].includes(extension)) {
        await renderPptx(panel, arrayBuffer);
      } else if (extension === "odp") {
        await renderOdp(panel, arrayBuffer);
      } else if (extension === "fodp") {
        renderOpenDocumentPresentationXml(panel, await readTextFromBuffer(arrayBuffer));
      } else if (isLegacyOfficeBinary(extension)) {
        renderLegacyOfficeBinary(panel, extension, arrayBuffer);
      } else {
        renderUnsupportedOffice(panel, extension || ctx.file.extension || "office");
      }
      const controller = createOfficeZoomController(panel, ctx);
      ctx.toolbar?.refreshCommandSupport();
      return {
        canCommand(command) {
          return delegatedInstance?.canCommand?.(command) || controller?.canCommand(command) || false;
        },
        command(command) {
          return delegatedInstance?.command?.(command) || controller?.command(command) || false;
        },
        destroy() {
          delegatedInstance?.destroy();
          controller?.destroy();
          disposeDocxFit?.();
          panel.remove();
        }
      };
    }
  };
}
async function createOfficeConversionContext(ctx, arrayBuffer, extension, detectedFormat) {
  const effectiveFormat = detectedFormat || extension;
  if ((effectiveFormat === "docx" || fileIsDocx(extension)) && await docxShouldPreferTextboxLayoutFallback(arrayBuffer)) {
    return { file: ctx.file, arrayBuffer, extension, detectedFormat, reason: "complex-docx" };
  }
  if (isLegacyOfficeBinary(extension)) {
    return { file: ctx.file, arrayBuffer, extension, detectedFormat, reason: "legacy-office" };
  }
  return void 0;
}
async function shouldUseOfficeConversion(options, context) {
  if (!options.convert) {
    return false;
  }
  if (typeof options.preferConversion === "function") {
    return Boolean(await options.preferConversion(context));
  }
  if (options.preferConversion !== void 0) {
    return options.preferConversion;
  }
  return context.reason === "complex-docx" || context.reason === "legacy-office";
}
async function renderConvertedOfficePreview(panel, ctx, options, conversionContext) {
  if (!options.convert) {
    throw new Error("Office conversion handler is not configured.");
  }
  const converted = normalizeOfficeConversionResult(await options.convert(conversionContext), ctx.file.name);
  if (!converted) {
    throw new Error("Office conversion handler did not return a previewable file.");
  }
  if (converted.mimeType !== "application/pdf" && !converted.fileName.toLowerCase().endsWith(".pdf")) {
    throw new Error("Office conversion handler must return a PDF Blob, ArrayBuffer or URL.");
  }
  return renderPdfDocumentPreview({
    ...options.pdf || {},
    fileName: converted.fileName,
    fileUrl: converted.fileUrl,
    fileSize: converted.fileSize,
    isExternal: !converted.revokeUrlOnDestroy,
    viewport: panel,
    size: ctx.size,
    fit: ctx.options.fit,
    zoom: ctx.options.zoom,
    toolbar: ctx.toolbar,
    title: "Office \u9AD8\u4FDD\u771F\u8F6C\u6362\u9884\u89C8",
    fallbackTitle: "Office \u8F6C\u6362\u540E\u7684 PDF \u65E0\u6CD5\u9884\u89C8",
    revokeUrlOnDestroy: converted.revokeUrlOnDestroy
  });
}
function normalizeOfficeConversionResult(result, sourceFileName) {
  if (!result) {
    return void 0;
  }
  const fallbackFileName = `${stripFileExtension(sourceFileName) || "office-preview"}.pdf`;
  if (typeof result === "string") {
    return {
      fileName: fallbackFileName,
      fileUrl: result,
      mimeType: "application/pdf",
      revokeUrlOnDestroy: false
    };
  }
  if (result instanceof ArrayBuffer) {
    const blob = new Blob([result], { type: "application/pdf" });
    return createConvertedOfficeBlobPreview(blob, fallbackFileName);
  }
  if (result instanceof Blob) {
    return createConvertedOfficeBlobPreview(result, fallbackFileName);
  }
  if (result.url) {
    return {
      fileName: result.fileName || fallbackFileName,
      fileUrl: result.url,
      mimeType: result.mimeType || "application/pdf",
      revokeUrlOnDestroy: false
    };
  }
  const data = result.blob || result.data;
  if (data instanceof ArrayBuffer) {
    const blob = new Blob([data], { type: result.mimeType || "application/pdf" });
    return createConvertedOfficeBlobPreview(blob, result.fileName || fallbackFileName);
  }
  if (data instanceof Blob) {
    return createConvertedOfficeBlobPreview(data, result.fileName || fallbackFileName);
  }
  return void 0;
}
function createConvertedOfficeBlobPreview(blob, fileName) {
  return {
    fileName,
    fileUrl: URL.createObjectURL(blob),
    fileSize: blob.size,
    mimeType: blob.type || "application/pdf",
    revokeUrlOnDestroy: true
  };
}
function stripFileExtension(fileName) {
  return fileName.replace(/\.[^.]+$/, "");
}
function createOfficeZoomController(panel, ctx) {
  const canZoom = Boolean(
    panel.querySelector(".ofv-docx-document, .ofv-sheet, .ofv-pptx-viewer > div, .ofv-document, .ofv-text-block, .ofv-slide")
  );
  if (!canZoom) {
    return void 0;
  }
  let zoom = getInitialZoom(ctx, 0.5, 3);
  const apply = () => {
    panel.style.setProperty("--ofv-office-zoom", String(zoom));
    panel.dispatchEvent(new CustomEvent("ofv-office-zoom"));
    for (const slide of panel.querySelectorAll(".ofv-pptx-viewer > div[data-slide-index]")) {
      slide.style.transformOrigin = "top left";
      slide.style.transform = zoom === 1 ? "" : `scale(${zoom})`;
    }
    ctx.toolbar?.setZoom(zoom);
  };
  apply();
  return {
    canCommand(command) {
      return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset";
    },
    command(command) {
      if (command === "zoom-in") {
        zoom = Math.min(3, Number((zoom + 0.12).toFixed(2)));
        apply();
        return true;
      }
      if (command === "zoom-out") {
        zoom = Math.max(0.5, Number((zoom - 0.12).toFixed(2)));
        apply();
        return true;
      }
      if (command === "zoom-reset") {
        zoom = 1;
        apply();
        return true;
      }
      return false;
    },
    destroy() {
      ctx.toolbar?.setZoom(void 0);
    }
  };
}
function fileIsDocx(extension) {
  return extension === "docx" || extension === "docm" || extension === "dotx" || extension === "dotm";
}
function shouldSniffPackagedOffice(extension) {
  return isLegacyOfficeBinary(extension) || packagedOfficeCandidates.has(extension) || extension === "";
}
async function detectPackagedOfficeFormat(arrayBuffer) {
  try {
    const zip = await JSZip3.loadAsync(arrayBuffer);
    const entries = Object.values(zip.files).filter((entry) => !entry.dir);
    const hasEntry = (path) => entries.some((entry) => entry.name.toLowerCase() === path.toLowerCase());
    if (hasEntry("word/document.xml")) {
      return "docx";
    }
    if (hasEntry("xl/workbook.xml")) {
      return "xlsx";
    }
    if (hasEntry("ppt/presentation.xml")) {
      return "pptx";
    }
  } catch {
    return void 0;
  }
  return void 0;
}
async function renderDocx(panel, arrayBuffer) {
  const content = document.createElement("div");
  content.className = "ofv-docx-document";
  const styleContainer = document.createElement("div");
  styleContainer.className = "ofv-docx-style-container";
  document.head.append(styleContainer);
  let disposeFit;
  try {
    const docxPreview = await import("docx-preview");
    await docxPreview.renderAsync(arrayBuffer, content, styleContainer, {
      className: "ofv-docx",
      inWrapper: true,
      breakPages: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      renderHeaders: true,
      renderFooters: true,
      renderFootnotes: true,
      renderEndnotes: true,
      renderComments: true,
      renderAltChunks: true,
      experimental: true,
      useBase64URL: true
    });
    await normalizeDocxLayout(content, arrayBuffer);
    const shouldUseTextboxFallback = await docxPreviewLooksBlank(content, arrayBuffer) || await docxPreviewMissesRichTextboxContent(content, arrayBuffer) || await docxShouldPreferTextboxLayoutFallback(arrayBuffer);
    if (shouldUseTextboxFallback) {
      disposeFit?.();
      styleContainer.remove();
      content.replaceChildren();
      await renderDocxContentFallback(content, arrayBuffer, {
        preferOpenXml: await docxHasRichTextboxContent(arrayBuffer)
      });
      panel.append(content);
      console.warn("DOCX layout preview missed readable textbox content, fell back to text extraction.");
      return () => void 0;
    }
    panel.append(content);
    disposeFit = fitDocxPages(content);
    return () => {
      disposeFit?.();
      styleContainer.remove();
    };
  } catch (error) {
    disposeFit?.();
    styleContainer.remove();
    content.replaceChildren();
    await renderDocxContentFallback(content, arrayBuffer);
    panel.append(content);
    console.warn("DOCX layout preview failed, fell back to Mammoth:", error);
  }
  return () => void 0;
}
async function docxPreviewLooksBlank(container, arrayBuffer) {
  if (container.querySelector("img, svg, canvas, table")) {
    return false;
  }
  const renderedText = normalizePreviewText(container.textContent || "");
  if (renderedText.length >= 24) {
    return false;
  }
  try {
    const paragraphs = await extractDocxParagraphs(arrayBuffer);
    const sourceText = normalizePreviewText(paragraphs.join(""));
    return sourceText.length >= 24 && sourceText.length > renderedText.length * 4;
  } catch {
    return false;
  }
}
async function docxPreviewMissesRichTextboxContent(container, arrayBuffer) {
  try {
    if (!await docxHasRichTextboxContent(arrayBuffer)) {
      return false;
    }
    const zip = await JSZip3.loadAsync(arrayBuffer);
    const documentXml = await zip.file("word/document.xml")?.async("text");
    if (!documentXml) {
      return false;
    }
    const sourceParagraphs = dedupeParagraphs(extractWordTextboxParagraphs(documentXml)).map((paragraph) => normalizePreviewText(paragraph)).filter((paragraph) => paragraph.length >= 3);
    if (sourceParagraphs.length < 4) {
      return false;
    }
    const renderedText = normalizePreviewText(container.textContent || "");
    const firstImportantParagraphs = sourceParagraphs.slice(0, Math.min(4, sourceParagraphs.length));
    const firstCoverage = firstImportantParagraphs.filter((paragraph) => renderedText.includes(paragraph)).length / firstImportantParagraphs.length;
    const totalCoverage = sourceParagraphs.filter((paragraph) => renderedText.includes(paragraph)).length / sourceParagraphs.length;
    return firstCoverage < 0.5 || totalCoverage < 0.45;
  } catch {
    return false;
  }
}
async function docxHasRichTextboxContent(arrayBuffer) {
  try {
    const zip = await JSZip3.loadAsync(arrayBuffer);
    const documentXml = await zip.file("word/document.xml")?.async("text");
    if (!documentXml || !/\btxbxContent\b/.test(documentXml)) {
      return false;
    }
    const textboxCount = (documentXml.match(/\btxbxContent\b/g) || []).length;
    const textboxParagraphs = extractWordTextboxParagraphs(documentXml);
    const textboxTextLength = normalizePreviewText(textboxParagraphs.join("")).length;
    const documentTextLength = normalizePreviewText(extractOpenXmlText(documentXml).join("")).length;
    return (textboxCount >= 3 || textboxParagraphs.length >= 3 || textboxTextLength >= 160) && textboxTextLength >= 8 && textboxTextLength >= documentTextLength * 0.4;
  } catch {
    return false;
  }
}
async function docxShouldPreferTextboxLayoutFallback(arrayBuffer) {
  try {
    const zip = await JSZip3.loadAsync(arrayBuffer);
    const documentXml = await zip.file("word/document.xml")?.async("text");
    if (!documentXml || !/\btxbxContent\b/.test(documentXml)) {
      return false;
    }
    const blocks = extractDocxTextboxBlocks(documentXml);
    const meaningfulBlocks = blocks.filter((block) => block.paragraphs.length > 0);
    const sidebarBackgrounds = blocks.filter(
      (block) => block.paragraphs.length === 0 && block.fill && block.relativeV === "page" && block.x < 0 && block.width >= 120 && block.height >= 500
    );
    const pageAnchoredTextboxes = meaningfulBlocks.filter((block) => block.relativeV === "page");
    const paragraphAnchoredTextboxes = meaningfulBlocks.filter((block) => block.relativeV !== "page");
    const leftTextboxes = meaningfulBlocks.filter((block) => block.x < 0);
    const rightTextboxes = meaningfulBlocks.filter((block) => block.x >= 80);
    return sidebarBackgrounds.length >= 2 && meaningfulBlocks.length >= 8 && pageAnchoredTextboxes.length >= 4 && paragraphAnchoredTextboxes.length >= 2 && leftTextboxes.length >= 3 && rightTextboxes.length >= 3;
  } catch {
    return false;
  }
}
async function renderDocxContentFallback(container, arrayBuffer, options = {}) {
  if (options.showNote !== false) {
    const fallbackNote = document.createElement("div");
    fallbackNote.className = "ofv-docx-fallback-note";
    fallbackNote.textContent = "\u9AD8\u4FDD\u771F DOCX \u6E32\u67D3\u4E0D\u53EF\u7528\uFF0C\u5DF2\u5207\u6362\u4E3A\u57FA\u7840\u5185\u5BB9\u9884\u89C8\u3002";
    hideSupplementalInfo3(fallbackNote);
    container.append(fallbackNote);
  }
  if (options.preferOpenXml) {
    if (await renderDocxTextboxLayoutFallback(container, arrayBuffer)) {
      return;
    }
    await renderDocxTextFallback(container, arrayBuffer);
    return;
  }
  try {
    await renderDocxWithMammoth(container, arrayBuffer);
    const renderedText = normalizePreviewText(container.querySelector(".ofv-document")?.textContent || "");
    if (renderedText.length >= 24) {
      return;
    }
    container.querySelector(".ofv-document")?.remove();
    await renderDocxTextFallback(container, arrayBuffer);
  } catch (fallbackError) {
    await renderDocxTextFallback(container, arrayBuffer);
    console.warn("DOCX content fallback failed, used raw OpenXML text extraction:", fallbackError);
  }
}
async function renderDocxTextboxLayoutFallback(container, arrayBuffer) {
  try {
    const zip = await JSZip3.loadAsync(arrayBuffer);
    const documentXml = await zip.file("word/document.xml")?.async("text");
    if (!documentXml) {
      return false;
    }
    const blocks = extractDocxTextboxBlocks(documentXml);
    const meaningfulBlocks = blocks.filter((block) => block.paragraphs.length > 0);
    if (meaningfulBlocks.length < 4) {
      return false;
    }
    if (renderDocxAnchoredTextboxFallback(container, meaningfulBlocks, blocks)) {
      return true;
    }
    const page = document.createElement("article");
    page.className = "ofv-document ofv-docx-textbox-layout";
    const sidebar = document.createElement("section");
    sidebar.className = "ofv-docx-textbox-sidebar";
    const main = document.createElement("section");
    main.className = "ofv-docx-textbox-main";
    const ordered = [...meaningfulBlocks].sort((a, b) => a.order - b.order);
    const leftThreshold = ordered.some((block) => block.x < 0) ? 0 : Math.min(...ordered.map((block) => block.x)) + 72;
    for (const block of ordered) {
      const card = createDocxTextboxBlockElement(block);
      if (block.x < leftThreshold && block.width < 260) {
        card.classList.add("ofv-docx-textbox-sidebar-block");
        sidebar.append(card);
      } else {
        card.classList.add("ofv-docx-textbox-main-block");
        main.append(card);
      }
    }
    if (sidebar.childElementCount === 0 || main.childElementCount === 0) {
      for (const block of ordered) {
        page.append(createDocxTextboxBlockElement(block));
      }
    } else {
      page.append(sidebar, main);
    }
    container.append(page);
    return true;
  } catch {
    return false;
  }
}
function extractDocxTextboxBlocks(xml) {
  const blocks = [];
  let order = 0;
  for (const match of xml.matchAll(/<wp:anchor\b[\s\S]*?<\/wp:anchor>/g)) {
    const anchor = match[0];
    const textboxMatches = [...anchor.matchAll(/<w:txbxContent\b[\s\S]*?<\/w:txbxContent>/g)];
    const extent = /<wp:extent\b[^>]*\bcx="(\d+)"[^>]*\bcy="(\d+)"/.exec(anchor);
    const offsets = [...anchor.matchAll(/<wp:posOffset>(-?\d+)<\/wp:posOffset>/g)].map((item) => Number(item[1]));
    const fill = /<a:solidFill>[\s\S]*?<a:srgbClr\b[^>]*\bval="([A-Fa-f0-9]+)"/.exec(anchor)?.[1];
    if (textboxMatches.length === 0 && !fill) {
      continue;
    }
    const block = {
      order,
      x: emuToPt(offsets[0] || 0),
      y: emuToPt(offsets[1] || 0),
      relativeV: /<wp:positionV\b[^>]*\brelativeFrom="([^"]+)"/.exec(anchor)?.[1] || "",
      width: emuToPt(Number(extent?.[1] || 0)),
      height: emuToPt(Number(extent?.[2] || 0)),
      fill,
      paragraphs: textboxMatches.length > 0 ? dedupeParagraphs(
        textboxMatches.flatMap((textbox) => extractWordTextboxParagraphs(textbox[0])).map((text) => text.replace(/\s+/g, " ").trim())
      ) : []
    };
    if (block.width > 0 && block.height > 0) {
      blocks.push(block);
    }
    order += 1;
  }
  return blocks;
}
function renderDocxAnchoredTextboxFallback(container, blocks, sourceBlocks = blocks) {
  const pageBlocks = blocks.filter((block) => block.relativeV === "page");
  const paragraphBlocks = blocks.filter((block) => block.relativeV !== "page");
  if (pageBlocks.length < 3 || paragraphBlocks.length < 4) {
    return false;
  }
  const continuationMarkers = findDocxTextboxContinuationMarkers(sourceBlocks);
  const continuationMarkerOrder = continuationMarkers[0]?.order ?? Number.POSITIVE_INFINITY;
  const firstPageBlocks = pageBlocks.filter(
    (block) => block.order < continuationMarkerOrder && !isDocxTextboxLargeBackground(block)
  );
  const firstPageParagraphBlocks = paragraphBlocks.filter(
    (block) => block.order < continuationMarkerOrder && isDocxTextboxFirstPageFlowBlock(block)
  );
  const continuationBlocks = blocks.filter(
    (block) => block.order >= continuationMarkerOrder || block.relativeV !== "page" && !isDocxTextboxFirstPageFlowBlock(block)
  );
  const continuationGroups = groupDocxTextboxContinuationBlocks(blocks, continuationMarkers, continuationMarkerOrder);
  if (firstPageBlocks.length < 3) {
    return false;
  }
  const page = document.createElement("article");
  page.className = "ofv-document ofv-docx-textbox-page";
  page.style.setProperty("--ofv-docx-textbox-page-width", "595pt");
  const contentLeft = Math.min(...firstPageBlocks.map((block) => block.x));
  const contentRight = Math.max(...firstPageBlocks.map((block) => block.x + Math.max(block.width, 24)));
  const normalizedWidth = Math.max(420, contentRight - contentLeft + 36);
  const pageWidth = Math.max(595, normalizedWidth);
  const normalizeX = (block) => block.x - contentLeft + (pageWidth - normalizedWidth) / 2;
  const normalizeY = (block) => Math.max(0, block.y + 24);
  const columns = classifyDocxTextboxColumns([...firstPageBlocks, ...firstPageParagraphBlocks, ...continuationBlocks], normalizeX);
  const sidebarBackground = findDocxTextboxSidebarBackground(sourceBlocks);
  if (sidebarBackground?.fill && renderDocxFirstPageFlowFallback(page, firstPageBlocks, firstPageParagraphBlocks, columns, sidebarBackground)) {
    container.append(page);
    appendDocxTextboxContinuationPages(
      container,
      continuationGroups.length > 0 ? continuationGroups : [continuationBlocks],
      columns,
      sidebarBackground
    );
    return true;
  }
  if (sidebarBackground?.fill) {
    page.classList.add("ofv-docx-textbox-page-has-sidebar");
    page.style.setProperty("--ofv-docx-textbox-sidebar-bg", `#${sidebarBackground.fill}`);
    page.style.setProperty("--ofv-docx-textbox-sidebar-width", `${formatCssNumber(inferDocxTextboxSidebarBackgroundWidth(columns))}pt`);
  }
  for (const block of firstPageBlocks) {
    const element = createDocxPositionedTextboxBlockElement(block);
    element.classList.add(columns.sidebar.has(block.order) ? "ofv-docx-textbox-page-sidebar-block" : "ofv-docx-textbox-page-main-block");
    if (columns.main.has(block.order)) {
      element.classList.remove("ofv-docx-textbox-page-filled-block");
    }
    element.style.left = `${formatCssNumber(normalizeX(block))}pt`;
    element.style.top = `${formatCssNumber(normalizeY(block))}pt`;
    element.style.width = `${formatCssNumber(Math.max(24, block.width))}pt`;
    if (block.height > 0) {
      element.style.minHeight = `${formatCssNumber(block.height)}pt`;
    }
    page.append(element);
  }
  const sidebarFlowBlocks = firstPageParagraphBlocks.filter((block) => columns.sidebar.has(block.order));
  const mainFlowBlocks = firstPageParagraphBlocks.filter((block) => columns.main.has(block.order));
  const pageAnchorsBottom = Math.max(
    ...firstPageBlocks.map((block) => normalizeY(block) + Math.max(block.height, estimateDocxTextboxBlockHeight(block)))
  );
  const sidebarFlowTop = estimateDocxTextboxColumnFlowStart(firstPageBlocks, columns.sidebar, normalizeY, pageAnchorsBottom);
  const mainFlowTop = estimateDocxTextboxColumnFlowStart(firstPageBlocks, columns.main, normalizeY, pageAnchorsBottom);
  const sidebarFlowBottom = appendDocxTextboxFlowColumn(page, sidebarFlowBlocks, {
    className: "ofv-docx-textbox-page-sidebar-flow",
    leftPt: columns.sidebarLeft,
    topPt: sidebarFlowTop,
    widthPt: columns.sidebarWidth
  });
  const mainFlowBottom = appendDocxTextboxFlowColumn(page, mainFlowBlocks, {
    className: "ofv-docx-textbox-page-main-flow",
    leftPt: columns.mainLeft,
    topPt: mainFlowTop,
    widthPt: columns.mainWidth
  });
  page.style.minHeight = `${formatCssNumber(Math.max(842, pageAnchorsBottom + 36, sidebarFlowBottom + 36, mainFlowBottom + 36))}pt`;
  container.append(page);
  appendDocxTextboxContinuationPages(
    container,
    continuationGroups.length > 0 ? continuationGroups : [continuationBlocks],
    columns,
    sidebarBackground
  );
  return true;
}
function findDocxTextboxContinuationMarkers(blocks) {
  return blocks.filter(isDocxTextboxLargeBackground).sort((a, b) => a.order - b.order).slice(1);
}
function isDocxTextboxLargeBackground(block) {
  return block.paragraphs.length === 0 && Boolean(block.fill) && block.relativeV === "page" && block.width >= 120 && block.height >= 500;
}
function isDocxTextboxFirstPageFlowBlock(block) {
  return block.y >= -5;
}
function renderDocxFirstPageFlowFallback(page, pageBlocks, paragraphBlocks, columns, sidebarBackground) {
  const sidebarBlocks = [...pageBlocks, ...paragraphBlocks].filter((block) => columns.sidebar.has(block.order) && block.paragraphs.length > 0).filter((block) => !isDocxTextboxDecorativeBlock(block)).sort(sortDocxTextboxFirstPageSidebarBlock);
  const mainBlocks = pageBlocks.filter((block) => columns.main.has(block.order) && block.paragraphs.length > 0).filter((block) => !isDocxTextboxDecorativeBlock(block)).sort(sortDocxTextboxFirstPageMainBlock);
  if (sidebarBlocks.length < 2 || mainBlocks.length < 2) {
    return false;
  }
  page.classList.add("ofv-docx-textbox-page-flow-layout");
  page.style.setProperty("--ofv-docx-textbox-sidebar-bg", `#${sidebarBackground.fill}`);
  page.style.setProperty("--ofv-docx-textbox-sidebar-width", `${formatCssNumber(inferDocxTextboxSidebarBackgroundWidth(columns))}pt`);
  const sidebar = document.createElement("aside");
  sidebar.className = "ofv-docx-textbox-page-flow-sidebar";
  const main = document.createElement("main");
  main.className = "ofv-docx-textbox-page-flow-main";
  for (const block of mergeDocxTextboxSidebarHeadingBlocks(sidebarBlocks)) {
    const element = createDocxTextboxBlockElement(block);
    element.classList.add("ofv-docx-textbox-flow-block");
    sidebar.append(element);
  }
  for (const block of mainBlocks) {
    const element = createDocxTextboxBlockElement(block);
    element.classList.add("ofv-docx-textbox-flow-block");
    main.append(element);
  }
  page.append(sidebar, main);
  return true;
}
function sortDocxTextboxFirstPageSidebarBlock(a, b) {
  return a.order - b.order;
}
function sortDocxTextboxFirstPageMainBlock(a, b) {
  const relationRank = (block) => block.relativeV === "page" ? 0 : 1;
  const rankDiff = relationRank(a) - relationRank(b);
  if (rankDiff !== 0) {
    return rankDiff;
  }
  const yDiff = a.y - b.y;
  return Math.abs(yDiff) > 12 ? yDiff : a.order - b.order;
}
function isDocxTextboxDecorativeBlock(block) {
  return block.fill !== void 0 && normalizePreviewText(block.paragraphs.join("")).length === 0 && block.width < 24 && block.height < 24;
}
function groupDocxTextboxContinuationBlocks(blocks, markers, firstMarkerOrder) {
  if (markers.length === 0) {
    return [];
  }
  return markers.map((marker, index) => {
    const nextMarkerOrder = markers[index + 1]?.order ?? Number.POSITIVE_INFINITY;
    const preMarkerParagraphBlocks = index === 0 ? blocks.filter(
      (block) => block.relativeV !== "page" && block.order < firstMarkerOrder && !isDocxTextboxFirstPageFlowBlock(block)
    ) : [];
    const markerPageBlocks = blocks.filter((block) => block.order >= marker.order && block.order < nextMarkerOrder);
    return [...preMarkerParagraphBlocks, ...markerPageBlocks].filter((block) => block.paragraphs.length > 0).sort((a, b) => a.order - b.order);
  }).filter((group) => group.length > 0);
}
function appendDocxTextboxContinuationPages(container, groups, columns, sidebarBackground) {
  for (const blocks of groups) {
    appendDocxTextboxContinuationPage(container, blocks, columns, sidebarBackground);
  }
}
function appendDocxTextboxContinuationPage(container, contentBlocks, columns, sidebarBackground) {
  if (contentBlocks.length === 0) {
    return;
  }
  const page = document.createElement("article");
  page.className = "ofv-document ofv-docx-textbox-page";
  page.style.setProperty("--ofv-docx-textbox-page-width", "595pt");
  if (sidebarBackground?.fill && renderDocxContinuationFlowFallback(page, contentBlocks, columns, sidebarBackground)) {
    container.append(page);
    return;
  }
  if (sidebarBackground?.fill) {
    page.classList.add("ofv-docx-textbox-page-has-sidebar");
    page.style.setProperty("--ofv-docx-textbox-sidebar-bg", `#${sidebarBackground.fill}`);
    page.style.setProperty("--ofv-docx-textbox-sidebar-width", `${formatCssNumber(inferDocxTextboxSidebarBackgroundWidth(columns))}pt`);
  }
  const sidebarFlowBottom = appendDocxTextboxFlowColumn(page, contentBlocks.filter((block) => columns.sidebar.has(block.order)), {
    className: "ofv-docx-textbox-page-sidebar-flow",
    leftPt: columns.sidebarLeft,
    topPt: 42,
    widthPt: columns.sidebarWidth
  });
  const mainFlowBottom = appendDocxTextboxFlowColumn(page, contentBlocks.filter((block) => columns.main.has(block.order)), {
    className: "ofv-docx-textbox-page-main-flow",
    leftPt: columns.mainLeft,
    topPt: 42,
    widthPt: columns.mainWidth
  });
  page.style.minHeight = `${formatCssNumber(Math.max(842, sidebarFlowBottom + 36, mainFlowBottom + 36))}pt`;
  container.append(page);
}
function renderDocxContinuationFlowFallback(page, contentBlocks, columns, sidebarBackground) {
  const sidebarBlocks = contentBlocks.filter((block) => columns.sidebar.has(block.order) && block.paragraphs.length > 0).filter((block) => !isDocxTextboxDecorativeBlock(block));
  const mainBlocks = contentBlocks.filter((block) => columns.main.has(block.order) && block.paragraphs.length > 0).filter((block) => !isDocxTextboxDecorativeBlock(block));
  if (sidebarBlocks.length === 0 && mainBlocks.length === 0) {
    return false;
  }
  page.classList.add("ofv-docx-textbox-page-flow-layout", "ofv-docx-textbox-continuation-flow-layout");
  page.style.setProperty("--ofv-docx-textbox-sidebar-bg", `#${sidebarBackground.fill}`);
  page.style.setProperty("--ofv-docx-textbox-sidebar-width", `${formatCssNumber(inferDocxTextboxSidebarBackgroundWidth(columns))}pt`);
  const sidebar = document.createElement("aside");
  sidebar.className = "ofv-docx-textbox-page-flow-sidebar";
  const main = document.createElement("main");
  main.className = "ofv-docx-textbox-page-flow-main";
  for (const block of mergeDocxTextboxSidebarHeadingBlocks(orderDocxTextboxFlowBlocks(sidebarBlocks))) {
    const element = createDocxTextboxBlockElement(block);
    element.classList.add("ofv-docx-textbox-flow-block");
    if (isStandaloneDocxTextboxHeadingBlock(block)) {
      element.classList.add("ofv-docx-textbox-section-heading");
    }
    sidebar.append(element);
  }
  for (const block of orderDocxTextboxFlowBlocks(mainBlocks)) {
    const element = createDocxTextboxBlockElement(block);
    element.classList.add("ofv-docx-textbox-flow-block");
    if (isStandaloneDocxTextboxHeadingBlock(block)) {
      element.classList.add("ofv-docx-textbox-section-heading");
    }
    main.append(element);
  }
  page.append(sidebar, main);
  return true;
}
function mergeDocxTextboxSidebarHeadingBlocks(blocks) {
  const merged = [];
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const next = blocks[index + 1];
    if (isStandaloneDocxTextboxHeadingBlock(block) && next && !isStandaloneDocxTextboxHeadingBlock(next)) {
      merged.push({
        ...next,
        order: block.order,
        paragraphs: [block.paragraphs[0], ...next.paragraphs]
      });
      index += 1;
    } else {
      merged.push(block);
    }
  }
  return merged;
}
function findDocxTextboxSidebarBackground(blocks) {
  return blocks.filter((block) => block.paragraphs.length === 0 && block.fill && block.relativeV === "page" && block.x < 0 && block.width >= 120 && block.height >= 500).sort((a, b) => b.height * b.width - a.height * a.width)[0];
}
function inferDocxTextboxSidebarBackgroundWidth(columns) {
  const contentRight = columns.sidebarLeft + columns.sidebarWidth + 4;
  const beforeMain = columns.mainLeft - 36;
  return Math.max(96, Math.min(contentRight, beforeMain));
}
function classifyDocxTextboxColumns(blocks, normalizeX) {
  const columnThreshold = inferDocxTextboxColumnThreshold(blocks);
  const leftBlocks = blocks.filter((block) => block.x < columnThreshold);
  const rightBlocks = blocks.filter((block) => !leftBlocks.includes(block));
  const sidebar = new Set(leftBlocks.map((block) => block.order));
  const main = new Set(rightBlocks.map((block) => block.order));
  const sidebarLeft = Math.max(28, Math.min(...leftBlocks.map((block) => normalizeX(block))));
  const mainLeft = Math.max(210, Math.min(...rightBlocks.map((block) => normalizeX(block))));
  const sidebarWidth = Math.min(180, Math.max(120, Math.max(...leftBlocks.map((block) => block.width))));
  const mainWidth = Math.min(380, Math.max(280, Math.max(...rightBlocks.map((block) => block.width))));
  return { sidebar, main, sidebarLeft, mainLeft, sidebarWidth, mainWidth };
}
function estimateDocxTextboxColumnFlowStart(pageBlocks, columnOrders, normalizeY, fallbackTop) {
  const sameColumnAnchors = pageBlocks.filter((block) => columnOrders.has(block.order));
  const anchorBottom = Math.max(
    0,
    ...sameColumnAnchors.map((block) => normalizeY(block) + Math.max(block.height, estimateDocxTextboxBlockHeight(block)))
  );
  if (anchorBottom > 0) {
    return anchorBottom + 14;
  }
  return fallbackTop + 18;
}
function inferDocxTextboxColumnThreshold(blocks) {
  const xs = [...new Set(blocks.map((block) => Math.round(block.x * 10) / 10))].sort((a, b) => a - b);
  if (xs.length < 2) {
    return xs[0] ?? 0;
  }
  let splitIndex = 0;
  let largestGap = -Infinity;
  for (let index = 0; index < xs.length - 1; index += 1) {
    const gap = xs[index + 1] - xs[index];
    if (gap > largestGap) {
      largestGap = gap;
      splitIndex = index;
    }
  }
  return (xs[splitIndex] + xs[splitIndex + 1]) / 2;
}
function appendDocxTextboxFlowColumn(page, blocks, options) {
  if (blocks.length === 0) {
    return options.topPt;
  }
  const column = document.createElement("div");
  column.className = `ofv-docx-textbox-page-flow ${options.className}`;
  column.style.left = `${formatCssNumber(options.leftPt)}pt`;
  column.style.top = `${formatCssNumber(options.topPt)}pt`;
  column.style.width = `${formatCssNumber(options.widthPt)}pt`;
  let flowBottom = options.topPt;
  for (const block of orderDocxTextboxFlowBlocks(blocks)) {
    const element = createDocxTextboxBlockElement(block);
    element.classList.add("ofv-docx-textbox-flow-block");
    column.append(element);
    flowBottom += estimateDocxTextboxBlockHeight(block) + 10;
  }
  page.append(column);
  return flowBottom;
}
function orderDocxTextboxFlowBlocks(blocks) {
  const ordered = [...blocks].sort((a, b) => a.order - b.order);
  const result = [];
  for (const block of ordered) {
    const previous = result[result.length - 1];
    const previousPrevious = result[result.length - 2];
    if (previous && isStandaloneDocxTextboxHeadingBlock(block) && !isStandaloneDocxTextboxHeadingBlock(previous) && !isStandaloneDocxTextboxHeadingBlock(previousPrevious)) {
      result.splice(result.length - 1, 0, block);
    } else {
      result.push(block);
    }
  }
  return result;
}
function isStandaloneDocxTextboxHeadingBlock(block) {
  if (!block || block.paragraphs.length !== 1) {
    return false;
  }
  return looksLikeDocxTextboxHeading(block.paragraphs[0]);
}
function createDocxPositionedTextboxBlockElement(block) {
  const section = createDocxTextboxBlockElement(block);
  section.classList.add("ofv-docx-textbox-page-block");
  if (block.fill) {
    section.classList.add("ofv-docx-textbox-page-filled-block");
  }
  if (block.paragraphs.length <= 2 && !block.fill) {
    section.classList.add("ofv-docx-textbox-page-title-block");
  }
  return section;
}
function createDocxTextboxBlockElement(block) {
  const section = document.createElement("section");
  section.className = "ofv-docx-textbox-block";
  if (block.fill) {
    section.classList.add("ofv-docx-textbox-block-filled");
    section.style.setProperty("--ofv-docx-textbox-fill", `#${block.fill}`);
  }
  const paragraphs = normalizeDocxTextboxParagraphOrder(block);
  const [first, ...rest] = paragraphs;
  if (first) {
    const sectionKind = getDocxTextboxSectionKind(first);
    if (sectionKind) {
      section.classList.add(`ofv-docx-textbox-section-${sectionKind}`);
    }
    const heading = document.createElement("h3");
    heading.textContent = first;
    section.append(heading);
  }
  const body = rest.length > 0 ? rest : [];
  for (const paragraphText of body) {
    const paragraph = document.createElement("p");
    paragraph.textContent = paragraphText;
    section.append(paragraph);
  }
  return section;
}
function getDocxTextboxSectionKind(heading) {
  const text = normalizePreviewText(heading);
  if (text.includes("\u6559\u80B2\u80CC\u666F")) {
    return "education";
  }
  if (text.includes("\u4E13\u4E1A\u6280\u80FD")) {
    return "skills";
  }
  if (text.includes("\u5DE5\u4F5C\u7ECF\u5386")) {
    return "work";
  }
  if (text.includes("\u9879\u76EE\u7ECF\u9A8C")) {
    return "projects";
  }
  if (text.includes("\u81EA\u6211\u8BC4\u4EF7")) {
    return "summary";
  }
  if (text.includes("\u57FA\u672C\u4FE1\u606F")) {
    return "profile";
  }
  return "";
}
function estimateDocxTextboxBlockHeight(block) {
  return Math.max(block.height, 18 + block.paragraphs.length * 14);
}
function normalizeDocxTextboxParagraphOrder(block) {
  if (!block.fill || block.paragraphs.length < 2) {
    return block.paragraphs;
  }
  const last = block.paragraphs[block.paragraphs.length - 1];
  if (looksLikeDocxTextboxHeading(last)) {
    return [last, ...block.paragraphs.slice(0, -1)];
  }
  return block.paragraphs;
}
function looksLikeDocxTextboxHeading(value) {
  const text = normalizePreviewText(value);
  return text.length > 0 && text.length <= 12 && !/[0-9@.:：]/.test(text);
}
async function normalizeDocxLayout(container, arrayBuffer) {
  const hints = await readDocxLayoutHints(arrayBuffer);
  const pages = container.querySelectorAll("section.ofv-docx");
  for (const page of pages) {
    repairDocxShapeFills(page);
    repairDocxFloatingPictures(page, hints);
    repairDocxHeadingShapeAlignment(page);
    repairDocxListIndentAlignment(page);
    for (const element of page.querySelectorAll("[style*='line-height']")) {
      const lineHeight = parseCssLineHeight(element.style.lineHeight);
      if (lineHeight > 0 && lineHeight < 1) {
        element.style.lineHeight = "1.2";
      }
    }
  }
}
function repairDocxHeadingShapeAlignment(page) {
  for (const paragraph of page.querySelectorAll("p")) {
    const text = normalizePreviewText(paragraph.textContent || "");
    if (!looksLikeDocxTextboxHeading(text)) {
      continue;
    }
    const svg = paragraph.querySelector("svg");
    if (!svg) {
      continue;
    }
    const width = parseCssPixelValue(svg.style.width) || parseCssPixelValue(svg.getAttribute("width") || "");
    const marginLeft = parseCssPixelValue(svg.style.marginLeft);
    if (width < 300 || marginLeft < 28 || marginLeft > 44) {
      continue;
    }
    const textWidth = getDocxParagraphVisibleTextWidth(paragraph);
    svg.style.marginLeft = `${formatCssNumber(Math.max(48, marginLeft + textWidth * 0.68))}pt`;
    svg.style.marginTop = `${formatCssNumber(parseCssPixelValue(svg.style.marginTop) - 4)}pt`;
    normalizeDocxHeadingShapeFill(svg);
    repairDocxHeadingTextBackground(paragraph);
  }
}
function normalizeDocxHeadingShapeFill(svg) {
  const headingFill = "#3f4aa3";
  const fillNodes = svg.querySelectorAll("image[fill], rect[data-ofv-docx-shape-fill]");
  for (const node of fillNodes) {
    const fill = node.getAttribute("fill") || "";
    if (fill.toLowerCase() === "#38449a") {
      node.setAttribute("fill", headingFill);
    }
  }
}
function repairDocxHeadingTextBackground(paragraph) {
  const textSpans = Array.from(paragraph.querySelectorAll("span")).filter(
    (element) => normalizePreviewText(element.textContent || "")
  );
  const lastTextSpan = textSpans.at(-1);
  if (!lastTextSpan || !hasWhiteBackground(lastTextSpan)) {
    return;
  }
  lastTextSpan.style.paddingRight = "3pt";
  lastTextSpan.style.paddingTop = "2pt";
  lastTextSpan.style.paddingBottom = "2pt";
  lastTextSpan.style.boxDecorationBreak = "clone";
}
function hasWhiteBackground(element) {
  const background = element.style.backgroundColor.replace(/\s+/g, "").toLowerCase();
  return background === "white" || background === "#fff" || background === "#ffffff" || background === "rgb(255,255,255)";
}
function getDocxParagraphVisibleTextWidth(paragraph) {
  let textWidth = 0;
  for (const element of paragraph.querySelectorAll("span")) {
    if (!normalizePreviewText(element.textContent || "")) {
      continue;
    }
    textWidth += pxToPt(element.getBoundingClientRect().width);
  }
  return textWidth;
}
function pxToPt(value) {
  return value * 0.75;
}
function repairDocxListIndentAlignment(page) {
  for (const paragraph of page.querySelectorAll("p[class*='ofv-docx-num-']")) {
    const text = normalizePreviewText(paragraph.textContent || "");
    if (!isDocxNumberListContinuationParagraph(paragraph, text)) {
      continue;
    }
    paragraph.style.textIndent = "42px";
  }
}
function isDocxNumberListContinuationParagraph(paragraph, text) {
  if (!text || /^[0-9]+[.、]/.test(text)) {
    return false;
  }
  const previousText = findAdjacentDocxParagraphText(paragraph, "previousElementSibling");
  const nextText = findAdjacentDocxParagraphText(paragraph, "nextElementSibling");
  return previousText.includes("\u5DE5\u4F5C\u63CF\u8FF0") || /^[3-9][.、]/.test(nextText);
}
function findAdjacentDocxParagraphText(paragraph, direction) {
  let sibling = paragraph[direction];
  while (sibling) {
    if (sibling instanceof HTMLElement && sibling.tagName.toLowerCase() === "p") {
      const text = normalizePreviewText(sibling.textContent || "");
      if (text) {
        return text;
      }
    }
    sibling = sibling[direction];
  }
  return "";
}
async function readDocxLayoutHints(arrayBuffer) {
  try {
    const zip = await JSZip3.loadAsync(arrayBuffer);
    const documentXml = await zip.file("word/document.xml")?.async("text");
    if (!documentXml) {
      return { floatingPictures: [] };
    }
    return { floatingPictures: extractFloatingPictureHints(documentXml) };
  } catch {
    return { floatingPictures: [] };
  }
}
function extractFloatingPictureHints(xml) {
  return [...xml.matchAll(/<wp:anchor\b[\s\S]*?<\/wp:anchor>/g)].filter((match) => /<a:graphicData\b[^>]*uri="http:\/\/schemas\.openxmlformats\.org\/drawingml\/2006\/picture"/.test(match[0])).map((match) => {
    const anchor = match[0];
    const extent = /<wp:extent\b[^>]*\bcx="(\d+)"[^>]*\bcy="(\d+)"/.exec(anchor);
    const offsetX = /<wp:positionH\b[^>]*\brelativeFrom="([^"]+)"[\s\S]*?<wp:posOffset>(-?\d+)<\/wp:posOffset>/.exec(anchor);
    const offsetY = /<wp:positionV\b[^>]*\brelativeFrom="([^"]+)"[\s\S]*?<wp:posOffset>(-?\d+)<\/wp:posOffset>/.exec(anchor);
    return {
      widthPt: emuToPt(Number(extent?.[1] || 0)),
      heightPt: emuToPt(Number(extent?.[2] || 0)),
      offsetXPt: emuToPt(Number(offsetX?.[2] || 0)),
      offsetYPt: emuToPt(Number(offsetY?.[2] || 0)),
      relativeFrom: offsetX?.[1] || "",
      relativeToParagraph: offsetY?.[1] === "paragraph",
      wrap: /<wp:wrapSquare\b/.test(anchor) ? "square" : /<wp:wrapNone\b/.test(anchor) ? "none" : ""
    };
  }).filter((hint) => hint.widthPt > 0 && hint.heightPt > 0);
}
function emuToPt(value) {
  return value / 12700;
}
function repairDocxShapeFills(page) {
  for (const svg of page.querySelectorAll("svg")) {
    const image = svg.querySelector("image[fill]");
    if (!image) {
      continue;
    }
    const fill = image.getAttribute("fill");
    if (!fill || svg.querySelector("rect[data-ofv-docx-shape-fill]")) {
      continue;
    }
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("data-ofv-docx-shape-fill", "true");
    rect.setAttribute("x", "0");
    rect.setAttribute("y", "0");
    rect.setAttribute("width", "100%");
    rect.setAttribute("height", "100%");
    rect.setAttribute("fill", fill);
    const stroke = image.getAttribute("stroke");
    if (stroke && stroke !== "null") {
      rect.setAttribute("stroke", stroke);
      rect.setAttribute("stroke-width", image.getAttribute("stroke-width") || "1");
    }
    svg.insertBefore(rect, svg.firstChild);
  }
}
function repairDocxFloatingPictures(page, hints) {
  const hint = hints.floatingPictures.find((item) => item.relativeFrom === "column" && item.wrap === "square");
  if (!hint) {
    return;
  }
  const image = page.querySelector("img");
  if (!image) {
    return;
  }
  const wrapper = image.parentElement;
  if (!wrapper || wrapper.dataset.ofvDocxFloatRepaired === "true") {
    return;
  }
  const pageWidth = parseCssPixelValue(page.style.width) || page.getBoundingClientRect().width;
  const pagePaddingRight = parseCssPixelValue(page.style.paddingRight || page.style.padding) || 0;
  const width = hint.widthPt;
  const left = Math.max(0, Math.min(pageWidth - pagePaddingRight - width, hint.offsetXPt));
  const paragraph = wrapper.closest("p");
  const paragraphTop = paragraph ? getElementTopInPt(paragraph, page) : getPagePaddingTopInPt(page);
  const top = hint.relativeToParagraph ? paragraphTop + hint.offsetYPt : hint.offsetYPt;
  wrapper.dataset.ofvDocxFloatRepaired = "true";
  wrapper.style.position = "absolute";
  wrapper.style.float = "none";
  wrapper.style.left = `${formatCssNumber(left)}pt`;
  wrapper.style.top = `${formatCssNumber(Math.max(0, top))}pt`;
  wrapper.style.width = `${formatCssNumber(width)}pt`;
  wrapper.style.height = `${formatCssNumber(hint.heightPt)}pt`;
  wrapper.style.zIndex = "1";
  image.style.width = "100%";
  image.style.height = "100%";
  image.style.objectFit = "cover";
}
function getElementTopInPt(element, page) {
  const pageRect = page.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const pageWidthPt = parseCssPixelValue(page.style.width) || 595.3;
  const pxPerPt = pageRect.width > 0 && pageWidthPt > 0 ? pageRect.width / pageWidthPt : 4 / 3;
  return (elementRect.top - pageRect.top) / pxPerPt;
}
function getPagePaddingTopInPt(page) {
  return parseCssPixelValue(page.style.paddingTop || page.style.padding) || 0;
}
function parseCssLineHeight(value) {
  const trimmed = value.trim();
  if (!trimmed || trimmed === "normal") {
    return 0;
  }
  if (trimmed.endsWith("%")) {
    const parsedPercent = Number.parseFloat(trimmed);
    return Number.isFinite(parsedPercent) ? parsedPercent / 100 : 0;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : 0;
}
function fitDocxPages(container) {
  const wrapper = container.querySelector(".ofv-docx-wrapper");
  if (!wrapper) {
    return () => void 0;
  }
  const panel = container.closest(".ofv-office");
  const update = () => {
    const frames = ensureDocxPageFrames(wrapper);
    if (frames.length === 0) {
      wrapper.style.removeProperty("--ofv-docx-scale");
      return;
    }
    const availableWidth = Math.max(1, container.clientWidth - 48);
    const pageWidth = Math.max(
      1,
      ...frames.map(({ page }) => {
        const rectWidth = page.getBoundingClientRect().width;
        return page.offsetWidth || rectWidth || parseCssPixelValue(page.style.width) || 794;
      })
    );
    const scale = Math.min(1, Math.max(0.35, availableWidth / pageWidth));
    const userZoom = parseCssPixelValue(panel?.style.getPropertyValue("--ofv-office-zoom") || "1") || 1;
    wrapper.style.setProperty("--ofv-docx-scale", formatCssNumber(scale));
    wrapper.style.setProperty("--ofv-docx-page-width", `${pageWidth}px`);
    for (const { frame, page } of frames) {
      const pageHeight = page.offsetHeight || page.getBoundingClientRect().height || parseCssPixelValue(page.style.height);
      if (pageHeight > 0) {
        frame.style.height = `${Math.ceil(pageHeight * scale * userZoom)}px`;
      }
    }
  };
  update();
  const timers = [0, 80, 240].map((delay) => window.setTimeout(update, delay));
  if (typeof ResizeObserver === "undefined") {
    window.addEventListener("resize", update);
    panel?.addEventListener("ofv-office-zoom", update);
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("resize", update);
      panel?.removeEventListener("ofv-office-zoom", update);
    };
  }
  const observer = new ResizeObserver(update);
  observer.observe(container);
  observer.observe(wrapper);
  panel?.addEventListener("ofv-office-zoom", update);
  return () => {
    timers.forEach((timer) => window.clearTimeout(timer));
    panel?.removeEventListener("ofv-office-zoom", update);
    observer.disconnect();
  };
}
function ensureDocxPageFrames(wrapper) {
  const pages = Array.from(wrapper.querySelectorAll("section.ofv-docx"));
  return pages.map((page) => {
    const parent = page.parentElement;
    if (parent?.classList.contains("ofv-docx-page-frame")) {
      return { frame: parent, page };
    }
    const frame = document.createElement("div");
    frame.className = "ofv-docx-page-frame";
    page.before(frame);
    frame.append(page);
    return { frame, page };
  });
}
function parseCssPixelValue(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
function formatCssNumber(value) {
  return Number.isFinite(value) ? value.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") : "1";
}
function normalizePreviewText(value) {
  return value.replace(/\s+/g, "").trim();
}
async function renderDocxTextFallback(container, arrayBuffer) {
  const article = document.createElement("article");
  article.className = "ofv-document";
  try {
    const paragraphs = dedupeParagraphs(await extractDocxReadableParagraphs(arrayBuffer));
    if (paragraphs.length > 0) {
      for (const paragraphText of paragraphs) {
        const paragraph = document.createElement("p");
        paragraph.textContent = paragraphText;
        article.append(paragraph);
      }
    } else {
      const empty = document.createElement("p");
      empty.textContent = "DOCX \u5185\u5BB9\u89E3\u6790\u5931\u8D25\uFF0C\u672A\u63D0\u53D6\u5230\u53EF\u5C55\u793A\u6587\u672C\u3002";
      article.append(empty);
    }
  } catch {
    const empty = document.createElement("p");
    empty.textContent = "DOCX \u5185\u5BB9\u89E3\u6790\u5931\u8D25\uFF0C\u6587\u4EF6\u53EF\u80FD\u5DF2\u635F\u574F\u6216\u4E0D\u662F\u6709\u6548\u7684 DOCX\u3002";
    article.append(empty);
  }
  container.append(article);
}
async function extractDocxParagraphs(arrayBuffer) {
  const zip = await JSZip3.loadAsync(arrayBuffer);
  const documentXml = await zip.file("word/document.xml")?.async("text");
  return documentXml ? extractWordParagraphs(documentXml) : [];
}
async function extractDocxReadableParagraphs(arrayBuffer) {
  const zip = await JSZip3.loadAsync(arrayBuffer);
  const documentXml = await zip.file("word/document.xml")?.async("text");
  if (!documentXml) {
    return [];
  }
  const textboxParagraphs = extractWordTextboxParagraphs(documentXml);
  const documentParagraphs = extractWordParagraphs(documentXml);
  if (textboxParagraphs.length === 0) {
    return documentParagraphs;
  }
  const uniqueTextboxParagraphs = dedupeParagraphs(textboxParagraphs);
  const textboxTextLength = normalizePreviewText(uniqueTextboxParagraphs.join("")).length;
  const documentTextLength = normalizePreviewText(documentParagraphs.join("")).length;
  if (documentTextLength > textboxTextLength * 1.5) {
    const filteredDocumentParagraphs = filterCombinedTextboxParagraphs(documentParagraphs, uniqueTextboxParagraphs);
    return filteredDocumentParagraphs.length > 0 ? [...filteredDocumentParagraphs, ...uniqueTextboxParagraphs] : uniqueTextboxParagraphs;
  }
  return uniqueTextboxParagraphs;
}
async function renderDocxWithMammoth(container, arrayBuffer) {
  const mammoth = await import("mammoth");
  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      convertImage: mammoth.images.imgElement(async (image) => ({
        src: `data:${image.contentType};base64,${await image.read("base64")}`
      }))
    }
  );
  const content = document.createElement("article");
  content.className = "ofv-document";
  content.innerHTML = sanitizeHtml(result.value || "<p>\u672A\u89E3\u6790\u5230\u53EF\u5C55\u793A\u5185\u5BB9\u3002</p>");
  container.append(content);
  if (result.messages.length > 0) {
    const notes = document.createElement("details");
    notes.className = "ofv-details";
    hideSupplementalInfo3(notes);
    const summary = document.createElement("summary");
    summary.textContent = `\u89E3\u6790\u63D0\u793A ${result.messages.length}`;
    const list = document.createElement("ul");
    for (const message of result.messages) {
      const item = document.createElement("li");
      item.textContent = message.message;
      list.append(item);
    }
    notes.append(summary, list);
    container.append(notes);
  }
}
async function renderOdt(panel, arrayBuffer) {
  const zip = await JSZip3.loadAsync(arrayBuffer);
  const content = zip.file("content.xml");
  if (!content) {
    renderPlainDocument(panel, "ODT \u6587\u6863", "\u672A\u627E\u5230 content.xml\u3002");
    return;
  }
  renderOpenDocumentXml(panel, "ODT \u6587\u6863", await content.async("text"));
}
function renderOpenDocumentXml(panel, title, xml) {
  const section = createSection(title);
  const article = document.createElement("article");
  article.className = "ofv-document";
  const blocks = extractOpenDocumentBlocks(xml);
  if (blocks.length > 0) {
    hideSuccessfulSectionHeading(section);
    for (const block of blocks) {
      const paragraph = document.createElement("p");
      paragraph.textContent = block;
      article.append(paragraph);
    }
  } else {
    const empty = document.createElement("p");
    empty.textContent = "\u672A\u63D0\u53D6\u5230\u53EF\u5C55\u793A\u6587\u672C\u3002";
    article.append(empty);
  }
  section.append(article);
  panel.append(section);
}
function renderPlainDocument(panel, title, text) {
  const section = createSection(title);
  if (text.trim()) {
    hideSuccessfulSectionHeading(section);
  }
  const pre = document.createElement("pre");
  pre.className = "ofv-text-block";
  pre.textContent = text || "\u672A\u63D0\u53D6\u5230\u53EF\u5C55\u793A\u6587\u672C\u3002";
  section.append(pre);
  panel.append(section);
}
async function renderSheet(panel, arrayBuffer, extension) {
  const xlsx = await import("xlsx");
  let workbook;
  try {
    workbook = extension === "csv" || extension === "tsv" ? xlsx.read(decodeTextBuffer(arrayBuffer), {
      type: "string",
      FS: extension === "tsv" ? "	" : ",",
      cellDates: true,
      cellNF: true,
      cellStyles: true
    }) : xlsx.read(arrayBuffer, { type: "array", cellDates: true, cellNF: true, cellStyles: true });
  } catch (error) {
    if (isLegacyOfficeBinary(extension)) {
      renderLegacyOfficeBinary(panel, extension, arrayBuffer, `\u8868\u683C\u89E3\u6790\u5931\u8D25\uFF1A${normalizeOfficeError(error)}`);
      return;
    }
    renderSheetFallback(panel, extension, normalizeOfficeError(error));
    return;
  }
  const chartPreviews = await readWorkbookCharts(arrayBuffer).catch(() => []);
  const workbookImages = await readWorkbookSheetImages(arrayBuffer).catch(() => /* @__PURE__ */ new Map());
  const tabs = document.createElement("div");
  tabs.className = "ofv-tabs";
  tabs.setAttribute("role", "tablist");
  const content = document.createElement("div");
  content.className = "ofv-sheet";
  content.setAttribute("role", "tabpanel");
  const buttons = /* @__PURE__ */ new Map();
  const renderSheetByName = (sheetName, sheetIndex) => {
    content.replaceChildren();
    buttons.forEach((button, name) => {
      const active = name === sheetName;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    content.setAttribute("aria-label", sheetName);
    const heading = document.createElement("h3");
    heading.textContent = sheetName;
    const sheet = workbook.Sheets[sheetName];
    const sheetImages = workbookImages.get(sheetName) || [];
    const range = trimWorkbookSheetRange(sheet, xlsx.utils.decode_range(sheet["!ref"] || "A1:A1"), xlsx.utils.decode_cell);
    const rowCount = range.e.r - range.s.r + 1;
    const columnCount = range.e.c - range.s.c + 1;
    const formulaRows = collectFormulaRows(sheet, range, xlsx.utils.encode_cell);
    const summary = document.createElement("div");
    summary.className = "ofv-sheet-summary";
    summary.hidden = true;
    summary.setAttribute("aria-hidden", "true");
    summary.style.display = "none";
    summary.textContent = `${rowCount} \u884C x ${columnCount} \u5217${formulaRows.length > 0 ? `\uFF0C\u5305\u542B ${formulaRows.length} \u4E2A\u516C\u5F0F\u5355\u5143\u683C` : ""}`;
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "ofv-table-scroll";
    const viewport = createSheetViewport(rowCount, columnCount);
    const columnSizing = { widths: /* @__PURE__ */ new Map() };
    const windowControls = createSheetWindowControls(viewport, () => renderTableWindow());
    const renderTableWindow = () => {
      tableWrapper.replaceChildren(
        createWorkbookSheetTable(
          sheet,
          range,
          sheetIndex,
          viewport,
          xlsx.utils.encode_cell,
          xlsx.utils.format_cell,
          columnSizing,
          renderTableWindow,
          sheetImages
        )
      );
      windowControls?.update();
    };
    content.append(heading, summary);
    if (windowControls) {
      content.append(windowControls.element);
    }
    content.append(tableWrapper);
    renderTableWindow();
    if (formulaRows.length > 0) {
      const details = document.createElement("details");
      details.className = "ofv-details ofv-formula-list";
      hideSupplementalInfo3(details);
      const detailsSummary = document.createElement("summary");
      detailsSummary.textContent = "\u516C\u5F0F\u660E\u7EC6";
      const list = document.createElement("ul");
      for (const item of formulaRows.slice(0, 200)) {
        const row = document.createElement("li");
        row.textContent = `${item.address}: ${item.formula}`;
        list.append(row);
      }
      if (formulaRows.length > 200) {
        const row = document.createElement("li");
        row.textContent = `\u8FD8\u6709 ${formulaRows.length - 200} \u4E2A\u516C\u5F0F\u672A\u5C55\u793A\u3002`;
        list.append(row);
      }
      details.append(detailsSummary, list);
      content.append(details);
    }
  };
  if (workbook.SheetNames.length === 0) {
    content.textContent = extension === "numbers" ? "Numbers \u6587\u4EF6\u9700\u8981\u670D\u52A1\u7AEF\u8F6C\u6362\u540E\u9AD8\u4FDD\u771F\u9884\u89C8\u3002" : "\u672A\u89E3\u6790\u5230\u8868\u683C\u3002";
  } else {
    for (const [index, sheetName] of workbook.SheetNames.entries()) {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", "false");
      button.textContent = sheetName;
      button.title = sheetName;
      button.addEventListener("click", () => renderSheetByName(sheetName, index));
      buttons.set(sheetName, button);
      tabs.append(button);
      if (index === 0) {
        renderSheetByName(sheetName, index);
      }
    }
  }
  panel.append(tabs, content);
  if (chartPreviews.length > 0) {
    panel.append(renderChartPreviewSection(chartPreviews));
  }
}
function renderSheetFallback(panel, extension, detail) {
  if (isEncryptedText(detail)) {
    renderEncryptedOfficeByFileInfo(panel, `.${extension || "sheet"}`, "Office \u6587\u4EF6\u5DF2\u52A0\u5BC6\uFF0C\u65E0\u6CD5\u5728\u7EBF\u9884\u89C8");
    return;
  }
  const section = createSection("\u8868\u683C\u89E3\u6790\u5931\u8D25");
  const title = document.createElement("p");
  title.textContent = `.${extension || "sheet"} \u6587\u4EF6\u65E0\u6CD5\u89E3\u6790\u4E3A\u53EF\u9884\u89C8\u8868\u683C\u3002`;
  const meta = document.createElement("p");
  meta.textContent = detail;
  const support = document.createElement("p");
  support.textContent = "\u8BF7\u786E\u8BA4\u6587\u4EF6\u672A\u52A0\u5BC6\u3001\u672A\u635F\u574F\uFF0C\u6216\u5148\u8F6C\u6362\u4E3A XLSX/CSV/ODS \u540E\u518D\u9884\u89C8\u3002";
  section.append(title, meta, support);
  panel.append(section);
}
async function readWorkbookSheetImages(arrayBuffer) {
  const zip = await JSZip3.loadAsync(arrayBuffer);
  const fileNames = Object.keys(zip.files);
  if (!fileNames.some((name) => /^xl\/drawings\/.+\.xml$/i.test(name)) || !fileNames.some((name) => /^xl\/media\//i.test(name))) {
    return /* @__PURE__ */ new Map();
  }
  const workbookXml = await zip.file("xl/workbook.xml")?.async("text");
  if (!workbookXml || typeof DOMParser === "undefined") {
    return /* @__PURE__ */ new Map();
  }
  const workbookDoc = parseOfficeXml(workbookXml);
  if (!workbookDoc) {
    return /* @__PURE__ */ new Map();
  }
  const workbookRels = await readOfficeRelationships(zip, "xl/workbook.xml");
  const result = /* @__PURE__ */ new Map();
  const sheetElements = Array.from(workbookDoc.getElementsByTagName("*")).filter((element) => element.localName === "sheet");
  for (const sheetElement of sheetElements) {
    const sheetName = sheetElement.getAttribute("name") || "";
    const relationshipId = getXmlAttribute3(sheetElement, "id");
    const sheetRel = workbookRels.find((rel) => rel.id === relationshipId && /\/worksheet$/i.test(rel.type));
    const sheetPath = resolveOfficeRelationshipTarget("xl/workbook.xml", sheetRel?.target);
    if (!sheetName || !sheetPath) {
      continue;
    }
    const images = await readWorksheetImages(zip, sheetPath);
    if (images.length > 0) {
      result.set(sheetName, images);
    }
  }
  return result;
}
async function readWorksheetImages(zip, sheetPath) {
  const sheetXml = await zip.file(sheetPath)?.async("text");
  const sheetDoc = sheetXml ? parseOfficeXml(sheetXml) : void 0;
  if (!sheetDoc) {
    return [];
  }
  const sheetRels = await readOfficeRelationships(zip, sheetPath);
  const drawingIds = Array.from(sheetDoc.getElementsByTagName("*")).filter((element) => element.localName === "drawing").map((element) => getXmlAttribute3(element, "id")).filter((id) => Boolean(id));
  const images = [];
  for (const drawingId of drawingIds) {
    const drawingRel = sheetRels.find((rel) => rel.id === drawingId && /\/drawing$/i.test(rel.type));
    const drawingPath = resolveOfficeRelationshipTarget(sheetPath, drawingRel?.target);
    if (drawingPath) {
      images.push(...await readWorksheetDrawingImages(zip, drawingPath));
    }
  }
  return images;
}
async function readWorksheetDrawingImages(zip, drawingPath) {
  const drawingXml = await zip.file(drawingPath)?.async("text");
  const drawingDoc = drawingXml ? parseOfficeXml(drawingXml) : void 0;
  if (!drawingDoc) {
    return [];
  }
  const drawingRels = await readOfficeRelationships(zip, drawingPath);
  const anchors = Array.from(drawingDoc.getElementsByTagName("*")).filter(
    (element) => element.localName === "twoCellAnchor" || element.localName === "oneCellAnchor"
  );
  const images = [];
  for (const anchor of anchors) {
    const from = Array.from(anchor.children).find((element) => element.localName === "from");
    const embedId = findDrawingImageRelationshipId(anchor);
    const mediaRel = drawingRels.find((rel) => rel.id === embedId && /\/image$/i.test(rel.type));
    const mediaPath = resolveOfficeRelationshipTarget(drawingPath, mediaRel?.target);
    const mediaFile = mediaPath ? zip.file(mediaPath) : void 0;
    if (!from || !mediaPath || !mediaFile) {
      continue;
    }
    const mimeType = mimeTypeFromImagePath(mediaPath);
    images.push({
      row: readDrawingMarkerIndex(from, "row"),
      column: readDrawingMarkerIndex(from, "col"),
      fileName: mediaPath.split("/").pop() || "image",
      mimeType,
      dataUrl: `data:${mimeType};base64,${await mediaFile.async("base64")}`,
      title: readDrawingImageTitle(anchor)
    });
  }
  return images;
}
function findDrawingImageRelationshipId(anchor) {
  for (const element of Array.from(anchor.getElementsByTagName("*"))) {
    if (element.localName === "blip") {
      return getXmlAttribute3(element, "embed") || getXmlAttribute3(element, "link") || void 0;
    }
  }
  return void 0;
}
function readDrawingImageTitle(anchor) {
  const nonVisualProperties = Array.from(anchor.getElementsByTagName("*")).find((element) => element.localName === "cNvPr");
  return nonVisualProperties?.getAttribute("descr") || nonVisualProperties?.getAttribute("name") || void 0;
}
function readDrawingMarkerIndex(marker, localName) {
  const element = Array.from(marker.children).find((child) => child.localName === localName);
  const value = Number.parseInt(element?.textContent || "0", 10);
  return Number.isFinite(value) && value >= 0 ? value : 0;
}
async function readOfficeRelationships(zip, partPath) {
  const xml = await zip.file(relationshipPathForPart(partPath))?.async("text");
  const doc = xml ? parseOfficeXml(xml) : void 0;
  if (!doc) {
    return [];
  }
  return Array.from(doc.getElementsByTagName("*")).filter((element) => element.localName === "Relationship").map((element) => ({
    id: element.getAttribute("Id") || "",
    type: element.getAttribute("Type") || "",
    target: element.getAttribute("Target") || ""
  }));
}
function parseOfficeXml(xml) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  return doc.querySelector("parsererror") ? void 0 : doc;
}
function resolveOfficeRelationshipTarget(sourcePath, target) {
  return resolvePptxRelationshipTarget(sourcePath, target);
}
function mimeTypeFromImagePath(path) {
  const extension = path.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "gif":
      return "image/gif";
    case "webp":
      return "image/webp";
    case "bmp":
      return "image/bmp";
    case "svg":
      return "image/svg+xml";
    case "png":
    default:
      return "image/png";
  }
}
function renderEncryptedOfficeByFileInfo(panel, fileLabel, title) {
  const section = createSection(title);
  section.classList.add("ofv-encrypted");
  const message = document.createElement("p");
  message.textContent = `${fileLabel} \u53EF\u80FD\u5DF2\u52A0\u5BC6\u6216\u53D7\u4FDD\u62A4\u3002\u8BF7\u4E0B\u8F7D\u540E\u4F7F\u7528 Office/WPS \u8F93\u5165\u5BC6\u7801\u6253\u5F00\uFF0C\u6216\u4E0A\u4F20\u89E3\u5BC6\u540E\u7684\u6587\u4EF6\u3002`;
  section.append(message);
  panel.append(section);
}
function isEncryptedText(value) {
  return /\b(password|encrypted|encrypt|protected|decrypt|permission|加密|密码|受保护)\b/i.test(value);
}
function renderFlatOds(panel, xml) {
  const sheets = parseFlatOds(xml);
  renderParsedSheets(panel, sheets, "FODS \u6587\u4EF6\u672A\u89E3\u6790\u5230\u8868\u683C\u3002");
}
function renderParsedSheets(panel, sheets, emptyMessage) {
  const tabs = document.createElement("div");
  tabs.className = "ofv-tabs";
  tabs.setAttribute("role", "tablist");
  const content = document.createElement("div");
  content.className = "ofv-sheet";
  content.setAttribute("role", "tabpanel");
  const buttons = /* @__PURE__ */ new Map();
  const renderSheetByIndex = (sheet, sheetIndex) => {
    content.replaceChildren();
    buttons.forEach((button, name) => {
      const active = name === sheet.name;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    content.setAttribute("aria-label", sheet.name);
    const heading = document.createElement("h3");
    heading.textContent = sheet.name;
    const summary = document.createElement("div");
    summary.className = "ofv-sheet-summary";
    summary.hidden = true;
    summary.setAttribute("aria-hidden", "true");
    summary.style.display = "none";
    const rowCount = sheet.rows.length;
    const columnCount = Math.max(0, ...sheet.rows.map((row) => row.length));
    summary.textContent = `${rowCount} \u884C x ${columnCount} \u5217${sheet.formulas.length > 0 ? `\uFF0C\u5305\u542B ${sheet.formulas.length} \u4E2A\u516C\u5F0F\u5355\u5143\u683C` : ""}`;
    const tableWrapper = document.createElement("div");
    tableWrapper.className = "ofv-table-scroll";
    const viewport = createSheetViewport(rowCount, columnCount);
    const columnSizing = { widths: /* @__PURE__ */ new Map() };
    const windowControls = createSheetWindowControls(viewport, () => renderTableWindow());
    const renderTableWindow = () => {
      tableWrapper.replaceChildren(createParsedSheetTable(sheet, sheetIndex, viewport, columnSizing, renderTableWindow));
      windowControls?.update();
    };
    content.append(heading, summary);
    if (windowControls) {
      content.append(windowControls.element);
    }
    content.append(tableWrapper);
    renderTableWindow();
    if (sheet.formulas.length > 0) {
      const details = document.createElement("details");
      details.className = "ofv-details ofv-formula-list";
      hideSupplementalInfo3(details);
      const detailsSummary = document.createElement("summary");
      detailsSummary.textContent = "\u516C\u5F0F\u660E\u7EC6";
      const list = document.createElement("ul");
      for (const item of sheet.formulas.slice(0, 200)) {
        const row = document.createElement("li");
        row.textContent = `${item.address}: ${item.formula}`;
        list.append(row);
      }
      if (sheet.formulas.length > 200) {
        const row = document.createElement("li");
        row.textContent = `\u8FD8\u6709 ${sheet.formulas.length - 200} \u4E2A\u516C\u5F0F\u672A\u5C55\u793A\u3002`;
        list.append(row);
      }
      details.append(detailsSummary, list);
      content.append(details);
    }
  };
  if (sheets.length === 0) {
    content.textContent = emptyMessage;
  } else {
    for (const [index, sheet] of sheets.entries()) {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", "false");
      button.textContent = sheet.name;
      button.title = sheet.name;
      button.addEventListener("click", () => renderSheetByIndex(sheet, index));
      buttons.set(sheet.name, button);
      tabs.append(button);
      if (index === 0) {
        renderSheetByIndex(sheet, index);
      }
    }
  }
  panel.append(tabs, content);
}
async function readWorkbookCharts(arrayBuffer) {
  const zip = await JSZip3.loadAsync(arrayBuffer);
  const chartEntries = Object.values(zip.files).filter((entry) => !entry.dir && /^xl\/charts\/chart\d+\.xml$/i.test(entry.name)).sort((a, b) => a.name.localeCompare(b.name));
  const charts = [];
  for (const [index, entry] of chartEntries.entries()) {
    const xml = await entry.async("text");
    const chart = parseChartXml(xml, entry.name.split("/").pop() || `chart${index + 1}.xml`);
    if (chart) {
      charts.push(chart);
    }
  }
  return charts;
}
function parseChartXml(xml, fallbackName) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    return null;
  }
  const type = detectChartType(doc);
  const title = textFromFirst(doc, "title") || fallbackName.replace(/\.xml$/i, "");
  const seriesElements = Array.from(doc.getElementsByTagName("*")).filter((element) => element.localName === "ser");
  const series = seriesElements.map((element, index) => parseChartSeries(element, index)).filter((item) => item.values.length > 0);
  if (series.length === 0) {
    return null;
  }
  return {
    name: fallbackName,
    type,
    title,
    categories: series.find((item) => item.categories.length > 0)?.categories || [],
    series: series.map((item) => ({ name: item.name, values: item.values }))
  };
}
function detectChartType(doc) {
  const chartType = Array.from(doc.getElementsByTagName("*")).find(
    (element) => element.localName.endsWith("Chart") && element.localName !== "chart"
  )?.localName;
  if (!chartType) {
    return "chart";
  }
  return chartType.replace(/Chart$/i, "").toLowerCase();
}
function parseChartSeries(element, index) {
  return {
    name: textFromFirst(element, "tx") || `Series ${index + 1}`,
    values: numbersFromFirst(element, "val"),
    categories: stringsFromFirst(element, "cat")
  };
}
function renderChartPreviewSection(charts) {
  const section = createSection("\u8868\u683C\u56FE\u8868\u9884\u89C8");
  const grid = document.createElement("div");
  grid.className = "ofv-chart-grid";
  for (const chart of charts) {
    grid.append(renderChartCard(chart));
  }
  section.append(grid);
  return section;
}
function renderChartCard(chart) {
  const card = document.createElement("article");
  card.className = "ofv-chart-card";
  const header = document.createElement("header");
  const title = document.createElement("h4");
  title.textContent = chart.title;
  const meta = document.createElement("span");
  meta.textContent = `${chart.type} \xB7 ${chart.series.length} \u4E2A\u7CFB\u5217`;
  header.append(title, meta);
  const svg = renderChartSvg(chart);
  const details = document.createElement("details");
  details.className = "ofv-details ofv-chart-data";
  hideSupplementalInfo3(details);
  const summary = document.createElement("summary");
  summary.textContent = "\u6570\u636E\u6458\u8981";
  const list = document.createElement("ul");
  for (const item of chart.series) {
    const row = document.createElement("li");
    row.textContent = `${item.name}: ${item.values.slice(0, 12).join(", ")}${item.values.length > 12 ? ` ... \u5171 ${item.values.length} \u9879` : ""}`;
    list.append(row);
  }
  details.append(summary, list);
  card.append(header, svg, details);
  return card;
}
function renderChartSvg(chart) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 640 260");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", chart.title);
  svg.classList.add("ofv-chart-svg");
  const allValues = chart.series.flatMap((item) => item.values).filter((value) => Number.isFinite(value));
  const max = Math.max(1, ...allValues);
  const min = Math.min(0, ...allValues);
  const span = max - min || 1;
  const colors = ["#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed"];
  const plot = { x: 48, y: 24, width: 552, height: 178 };
  appendSvg(svg, "line", { x1: plot.x, y1: plot.y, x2: plot.x, y2: plot.y + plot.height, class: "ofv-chart-axis" });
  appendSvg(svg, "line", {
    x1: plot.x,
    y1: plot.y + plot.height,
    x2: plot.x + plot.width,
    y2: plot.y + plot.height,
    class: "ofv-chart-axis"
  });
  chart.series.forEach((series, seriesIndex) => {
    const color = colors[seriesIndex % colors.length];
    const step = series.values.length > 1 ? plot.width / (series.values.length - 1) : plot.width;
    const points = series.values.map((value, index) => ({
      x: plot.x + index * step,
      y: plot.y + plot.height - (value - min) / span * plot.height
    }));
    if (chart.type.includes("bar") || chart.type.includes("col")) {
      const barWidth = Math.max(4, Math.min(28, step * 0.6)) / Math.max(1, chart.series.length);
      points.forEach((point, index) => {
        const zeroY = plot.y + plot.height - (0 - min) / span * plot.height;
        const x = point.x - barWidth * chart.series.length / 2 + seriesIndex * barWidth;
        appendSvg(svg, "rect", {
          x,
          y: Math.min(point.y, zeroY),
          width: barWidth,
          height: Math.max(1, Math.abs(zeroY - point.y)),
          fill: color,
          "data-index": index
        });
      });
    } else {
      appendSvg(svg, "polyline", {
        points: points.map((point) => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(" "),
        fill: "none",
        stroke: color,
        "stroke-width": 3,
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      });
      for (const point of points.slice(0, 80)) {
        appendSvg(svg, "circle", { cx: point.x, cy: point.y, r: 3, fill: color });
      }
    }
    appendLegend(svg, series.name, color, 52 + seriesIndex * 118, 236);
  });
  return svg;
}
function appendLegend(svg, label, color, x, y) {
  appendSvg(svg, "rect", { x, y: y - 10, width: 12, height: 12, rx: 2, fill: color });
  const text = appendSvg(svg, "text", { x: x + 18, y, class: "ofv-chart-label" });
  text.textContent = label.length > 16 ? `${label.slice(0, 16)}...` : label;
}
function appendSvg(parent, tag, attributes) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }
  parent.append(element);
  return element;
}
function textFromFirst(root, localName) {
  const element = Array.from(root.querySelectorAll("*")).find((item) => item.localName === localName);
  return element ? chartText(element) : "";
}
function stringsFromFirst(root, localName) {
  const element = Array.from(root.querySelectorAll("*")).find((item) => item.localName === localName);
  if (!element) {
    return [];
  }
  return chartStringValues(element);
}
function numbersFromFirst(root, localName) {
  const element = Array.from(root.querySelectorAll("*")).find((item) => item.localName === localName);
  if (!element) {
    return [];
  }
  return Array.from(element.querySelectorAll("*")).filter((item) => item.localName === "v").map((item) => Number(item.textContent || "")).filter((value) => Number.isFinite(value));
}
function chartText(element) {
  return Array.from(element.querySelectorAll("*")).filter((item) => item.localName === "v" || item.localName === "t").map((item) => item.textContent?.trim() || "").find(Boolean) || "";
}
function chartStringValues(element) {
  return Array.from(element.querySelectorAll("*")).filter((item) => item.localName === "v" || item.localName === "t").map((item) => item.textContent?.trim() || "").filter(Boolean);
}
function trimWorkbookSheetRange(sheet, range, decodeCell) {
  let minRow = Number.POSITIVE_INFINITY;
  let minColumn = Number.POSITIVE_INFINITY;
  let maxRow = Number.NEGATIVE_INFINITY;
  let maxColumn = Number.NEGATIVE_INFINITY;
  const include = (row, column) => {
    minRow = Math.min(minRow, row);
    minColumn = Math.min(minColumn, column);
    maxRow = Math.max(maxRow, row);
    maxColumn = Math.max(maxColumn, column);
  };
  for (const [address, cell] of Object.entries(sheet)) {
    if (address.startsWith("!")) {
      continue;
    }
    if (!cell || cell.v == null && !cell.f && !cell.w && !cell.h) {
      continue;
    }
    const decoded = decodeCell(address);
    include(decoded.r, decoded.c);
  }
  for (const merge of sheet["!merges"] || []) {
    include(merge.s.r, merge.s.c);
    include(merge.e.r, merge.e.c);
  }
  if (!Number.isFinite(minRow) || !Number.isFinite(minColumn) || !Number.isFinite(maxRow) || !Number.isFinite(maxColumn)) {
    return range;
  }
  return {
    s: {
      r: Math.max(range.s.r, minRow),
      c: Math.max(range.s.c, minColumn)
    },
    e: {
      r: Math.min(range.e.r, maxRow),
      c: Math.min(range.e.c, maxColumn)
    }
  };
}
function createSheetViewport(rowCount, columnCount) {
  return {
    rowStart: 0,
    columnStart: 0,
    rowCount,
    columnCount
  };
}
function createSheetWindowControls(viewport, render) {
  const needsRows = viewport.rowCount > SHEET_WINDOW_ROWS;
  const needsColumns = viewport.columnCount > SHEET_WINDOW_COLUMNS;
  if (!needsRows && !needsColumns) {
    return null;
  }
  const controls = document.createElement("div");
  controls.className = "ofv-sheet-window";
  const note = document.createElement("span");
  note.className = "ofv-sheet-window-note";
  const rowBack = createWindowButton("\u4E0A 200 \u884C", () => {
    viewport.rowStart = Math.max(0, viewport.rowStart - SHEET_WINDOW_ROWS);
    render();
  });
  const rowNext = createWindowButton("\u4E0B 200 \u884C", () => {
    viewport.rowStart = Math.min(maxStart(viewport.rowCount, SHEET_WINDOW_ROWS), viewport.rowStart + SHEET_WINDOW_ROWS);
    render();
  });
  const colBack = createWindowButton("\u5DE6 80 \u5217", () => {
    viewport.columnStart = Math.max(0, viewport.columnStart - SHEET_WINDOW_COLUMNS);
    render();
  });
  const colNext = createWindowButton("\u53F3 80 \u5217", () => {
    viewport.columnStart = Math.min(
      maxStart(viewport.columnCount, SHEET_WINDOW_COLUMNS),
      viewport.columnStart + SHEET_WINDOW_COLUMNS
    );
    render();
  });
  controls.append(note, rowBack, rowNext, colBack, colNext);
  const update = () => {
    const rowEnd = Math.min(viewport.rowStart + SHEET_WINDOW_ROWS, viewport.rowCount);
    const columnEnd = Math.min(viewport.columnStart + SHEET_WINDOW_COLUMNS, viewport.columnCount);
    note.textContent = `\u5927\u8868\u683C\u7A97\u53E3\u5316\u6E32\u67D3\uFF1A\u5F53\u524D ${viewport.rowStart + 1}-${rowEnd} \u884C\uFF0C${viewport.columnStart + 1}-${columnEnd} \u5217`;
    rowBack.disabled = viewport.rowStart === 0;
    rowNext.disabled = viewport.rowStart >= maxStart(viewport.rowCount, SHEET_WINDOW_ROWS);
    colBack.disabled = viewport.columnStart === 0;
    colNext.disabled = viewport.columnStart >= maxStart(viewport.columnCount, SHEET_WINDOW_COLUMNS);
    rowBack.hidden = rowNext.hidden = !needsRows;
    colBack.hidden = colNext.hidden = !needsColumns;
  };
  update();
  return { element: controls, update };
}
function createWindowButton(label, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}
function maxStart(total, size) {
  return Math.max(0, total - size);
}
function createWorkbookSheetTable(sheet, range, sheetIndex, viewport, encodeCell, formatCell, columnSizing, rerender, images = []) {
  const table = document.createElement("table");
  table.id = `ofv-sheet-${sheetIndex + 1}`;
  table.className = "ofv-workbook-table";
  const rowEnd = Math.min(range.s.r + viewport.rowStart + SHEET_WINDOW_ROWS - 1, range.e.r);
  const columnEnd = Math.min(range.s.c + viewport.columnStart + SHEET_WINDOW_COLUMNS - 1, range.e.c);
  const columnStart = range.s.c + viewport.columnStart;
  const rowStart = range.s.r + viewport.rowStart;
  const mergePlan = createSheetMergePlan(sheet["!merges"] || [], rowStart, rowEnd, columnStart, columnEnd);
  const imagesByCell = groupWorkbookImagesByCell(images);
  const colGroup = document.createElement("colgroup");
  let tableWidth = 0;
  for (let columnIndex = columnStart; columnIndex <= columnEnd; columnIndex += 1) {
    const col = document.createElement("col");
    const width = columnSizing.widths.get(columnIndex) ?? getSheetColumnWidth(sheet["!cols"]?.[columnIndex]);
    col.dataset.columnIndex = String(columnIndex);
    col.style.width = `${width}px`;
    tableWidth += width;
    colGroup.append(col);
  }
  table.style.width = `${tableWidth}px`;
  table.append(colGroup);
  for (let rowIndex = rowStart; rowIndex <= rowEnd; rowIndex += 1) {
    const row = document.createElement("tr");
    const rowHeight = getSheetRowHeight(sheet["!rows"]?.[rowIndex]);
    if (rowHeight) {
      row.style.height = `${rowHeight}px`;
    }
    for (let columnIndex = columnStart; columnIndex <= columnEnd; columnIndex += 1) {
      const address = encodeCell({ r: rowIndex, c: columnIndex });
      const coordinateKey = `${rowIndex}:${columnIndex}`;
      if (mergePlan.covered.has(coordinateKey)) {
        continue;
      }
      const merge = mergePlan.anchors.get(coordinateKey);
      const sourceAddress = merge ? encodeCell({ r: merge.sourceRow, c: merge.sourceColumn }) : address;
      const sourceCell = sheet[sourceAddress];
      const cell = document.createElement(rowIndex === range.s.r ? "th" : "td");
      cell.dataset.cell = address;
      if (sourceAddress !== address) {
        cell.dataset.sourceCell = sourceAddress;
      }
      if (merge) {
        cell.classList.add("ofv-cell-merged");
        if (merge.rowspan > 1) {
          cell.rowSpan = merge.rowspan;
        }
        if (merge.colspan > 1) {
          cell.colSpan = merge.colspan;
        }
      }
      const text = sourceCell ? formatCell(sourceCell) : "";
      cell.textContent = text;
      if (text) {
        cell.title = text;
      }
      applyWorkbookCellStyle(cell, sourceCell);
      if (sourceCell?.f) {
        cell.classList.add("ofv-cell-formula");
        cell.title = `=${sourceCell.f}`;
      }
      if (text.includes("\n")) {
        cell.classList.add("ofv-cell-multiline");
      }
      appendWorkbookCellImages(cell, imagesByCell.get(`${rowIndex}:${columnIndex}`), text);
      appendColumnResizeHandle(cell, columnIndex, columnSizing);
      row.append(cell);
    }
    table.append(row);
  }
  return table;
}
function appendColumnResizeHandle(cell, columnIndex, columnSizing) {
  const handle = document.createElement("span");
  handle.className = "ofv-column-resize-handle";
  handle.setAttribute("aria-hidden", "true");
  handle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const startX = event.clientX;
    const startWidth = columnSizing.widths.get(columnIndex) ?? cell.getBoundingClientRect().width;
    handle.setPointerCapture(event.pointerId);
    const onMove = (moveEvent) => {
      const nextWidth = Math.max(48, Math.min(720, Math.round(startWidth + moveEvent.clientX - startX)));
      columnSizing.widths.set(columnIndex, nextWidth);
      updateRenderedColumnWidth(cell, columnIndex, nextWidth);
    };
    const onEnd = () => {
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onEnd);
      handle.removeEventListener("pointercancel", onEnd);
    };
    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onEnd);
    handle.addEventListener("pointercancel", onEnd);
  });
  cell.append(handle);
}
function updateRenderedColumnWidth(cell, columnIndex, width) {
  const table = cell.closest("table");
  if (!table) {
    return;
  }
  const column = Array.from(table.querySelectorAll("col")).find(
    (col) => col.dataset.columnIndex === String(columnIndex)
  );
  if (column) {
    column.style.width = `${width}px`;
  }
  const tableWidth = Array.from(table.querySelectorAll("col")).reduce((sum, col) => {
    const parsed = Number.parseFloat(col.style.width);
    return sum + (Number.isFinite(parsed) ? parsed : 0);
  }, 0);
  if (tableWidth > 0) {
    table.style.width = `${Math.round(tableWidth)}px`;
  }
}
function createSheetMergePlan(merges, rowStart, rowEnd, columnStart, columnEnd) {
  const anchors = /* @__PURE__ */ new Map();
  const covered = /* @__PURE__ */ new Set();
  const encode = (row, column) => `${row}:${column}`;
  for (const merge of merges) {
    if (merge.e.r < rowStart || merge.s.r > rowEnd || merge.e.c < columnStart || merge.s.c > columnEnd) {
      continue;
    }
    const visibleStartRow = Math.max(merge.s.r, rowStart);
    const visibleEndRow = Math.min(merge.e.r, rowEnd);
    const visibleStartColumn = Math.max(merge.s.c, columnStart);
    const visibleEndColumn = Math.min(merge.e.c, columnEnd);
    const anchor = encode(visibleStartRow, visibleStartColumn);
    anchors.set(anchor, {
      rowspan: visibleEndRow - visibleStartRow + 1,
      colspan: visibleEndColumn - visibleStartColumn + 1,
      sourceRow: merge.s.r,
      sourceColumn: merge.s.c
    });
    for (let rowIndex = visibleStartRow; rowIndex <= visibleEndRow; rowIndex += 1) {
      for (let columnIndex = visibleStartColumn; columnIndex <= visibleEndColumn; columnIndex += 1) {
        const address = encode(rowIndex, columnIndex);
        if (address !== anchor) {
          covered.add(address);
        }
      }
    }
  }
  return { anchors, covered };
}
function groupWorkbookImagesByCell(images) {
  const grouped = /* @__PURE__ */ new Map();
  for (const image of images) {
    const key = `${image.row}:${image.column}`;
    const items = grouped.get(key) || [];
    items.push(image);
    grouped.set(key, items);
  }
  return grouped;
}
function appendWorkbookCellImages(cell, images, text) {
  if (!images?.length) {
    return;
  }
  if (isWorkbookImagePlaceholderValue(text)) {
    cell.textContent = "";
    cell.removeAttribute("title");
  }
  cell.classList.add("ofv-cell-image");
  for (const image of images) {
    const figure = document.createElement("figure");
    figure.className = "ofv-workbook-image";
    const element = document.createElement("img");
    element.src = image.dataUrl;
    element.alt = image.title || image.fileName || "Excel embedded image";
    element.loading = "lazy";
    figure.append(element);
    cell.append(figure);
  }
}
function isWorkbookImagePlaceholderValue(text) {
  return /^#(?:VALUE|NAME|REF|N\/A|NULL|NUM|DIV\/0)!?$/i.test(text.trim());
}
function getSheetColumnWidth(column) {
  if (column?.hidden) {
    return 0;
  }
  const width = column?.wpx || (column?.wch ? column.wch * 7 + 5 : void 0) || (column?.width ? column.width * 7 : void 0) || 96;
  return Math.max(28, Math.min(360, Math.round(width)));
}
function getSheetRowHeight(row) {
  if (row?.hidden) {
    return 0;
  }
  const height = row?.hpx || (row?.hpt ? row.hpt * 1.333 : void 0);
  return height ? Math.max(18, Math.min(260, Math.round(height))) : void 0;
}
function applyWorkbookCellStyle(cell, sourceCell) {
  const style = sourceCell?.s;
  if (!style) {
    return;
  }
  const fill = readWorkbookColor(style.fgColor || style.fill?.fgColor);
  if (fill && style.patternType !== "none") {
    cell.style.backgroundColor = fill;
  }
  const font = style.font;
  if (font) {
    if (font.bold) {
      cell.style.fontWeight = "700";
    }
    if (font.italic) {
      cell.style.fontStyle = "italic";
    }
    if (font.sz) {
      cell.style.fontSize = `${Math.max(9, Math.min(24, Number(font.sz)))}pt`;
    }
    const fontColor = readWorkbookColor(font.color);
    if (fontColor) {
      cell.style.color = fontColor;
    }
  }
  const alignment = style.alignment;
  if (alignment) {
    const horizontal = normalizeSheetHorizontalAlign(alignment.horizontal);
    if (horizontal) {
      cell.style.textAlign = horizontal;
    }
    const vertical = normalizeSheetVerticalAlign(alignment.vertical);
    if (vertical) {
      cell.style.verticalAlign = vertical;
    }
    if (alignment.wrapText) {
      cell.classList.add("ofv-cell-multiline");
    }
  }
}
function readWorkbookColor(color) {
  if (!color?.rgb) {
    return void 0;
  }
  const rgb = color.rgb.length === 8 ? color.rgb.slice(2) : color.rgb;
  return /^[\da-f]{6}$/i.test(rgb) ? `#${rgb}` : void 0;
}
function normalizeSheetHorizontalAlign(value) {
  if (value === "center" || value === "right" || value === "left" || value === "justify") {
    return value;
  }
  return void 0;
}
function normalizeSheetVerticalAlign(value) {
  if (value === "top" || value === "middle" || value === "bottom") {
    return value;
  }
  return void 0;
}
function createParsedSheetTable(sheet, sheetIndex, viewport, columnSizing, rerender) {
  const table = document.createElement("table");
  table.id = `ofv-sheet-${sheetIndex + 1}`;
  const formulaMap = new Map(sheet.formulas.map((item) => [item.address, item.formula]));
  const rowEnd = Math.min(viewport.rowStart + SHEET_WINDOW_ROWS, sheet.rows.length);
  const columnEnd = Math.min(viewport.columnStart + SHEET_WINDOW_COLUMNS, viewport.columnCount);
  const colGroup = document.createElement("colgroup");
  let tableWidth = 0;
  for (let columnIndex = viewport.columnStart; columnIndex < columnEnd; columnIndex += 1) {
    const width = columnSizing.widths.get(columnIndex) ?? 112;
    const col = document.createElement("col");
    col.dataset.columnIndex = String(columnIndex);
    col.style.width = `${width}px`;
    tableWidth += width;
    colGroup.append(col);
  }
  table.style.width = `${tableWidth}px`;
  table.append(colGroup);
  for (let rowIndex = viewport.rowStart; rowIndex < rowEnd; rowIndex += 1) {
    const sourceRow = sheet.rows[rowIndex] || [];
    const row = document.createElement("tr");
    for (let columnIndex = viewport.columnStart; columnIndex < columnEnd; columnIndex += 1) {
      const value = sourceRow[columnIndex] || "";
      const cell = document.createElement(rowIndex === 0 ? "th" : "td");
      const address = encodeA1(rowIndex, columnIndex);
      cell.dataset.cell = address;
      cell.textContent = value;
      if (value) {
        cell.title = value;
      }
      const formula = formulaMap.get(address);
      if (formula) {
        cell.classList.add("ofv-cell-formula");
        cell.title = formula;
      }
      if (value.includes("\n")) {
        cell.classList.add("ofv-cell-multiline");
      }
      appendColumnResizeHandle(cell, columnIndex, columnSizing);
      row.append(cell);
    }
    table.append(row);
  }
  return table;
}
function parseFlatOds(xml) {
  const documentXml = new DOMParser().parseFromString(xml, "application/xml");
  if (documentXml.querySelector("parsererror")) {
    return [];
  }
  return Array.from(documentXml.getElementsByTagName("*")).filter((element) => element.localName === "table").map((tableElement, tableIndex) => parseFlatOdsTable(tableElement, tableIndex)).filter((sheet) => sheet.rows.length > 0);
}
function parseFlatOdsTable(tableElement, tableIndex) {
  const rows = [];
  const formulas = [];
  const sheetName = getXmlAttribute3(tableElement, "name") || `Sheet ${tableIndex + 1}`;
  for (const rowElement of Array.from(tableElement.children).filter((element) => element.localName === "table-row")) {
    const repeatRows = clampRepeat(getXmlAttribute3(rowElement, "number-rows-repeated"), 200);
    const parsedRow = parseFlatOdsRow(rowElement, rows.length, formulas);
    for (let index = 0; index < repeatRows; index += 1) {
      rows.push([...parsedRow]);
    }
  }
  trimEmptyTrailingRows(rows);
  return { name: sheetName, rows, formulas };
}
function parseFlatOdsRow(rowElement, rowIndex, formulas) {
  const row = [];
  for (const cellElement of Array.from(rowElement.children).filter(
    (element) => element.localName === "table-cell" || element.localName === "covered-table-cell"
  )) {
    const repeatColumns = clampRepeat(getXmlAttribute3(cellElement, "number-columns-repeated"), 256);
    const value = extractFlatOdsCellValue(cellElement);
    const formula = getXmlAttribute3(cellElement, "formula");
    for (let index = 0; index < repeatColumns; index += 1) {
      const columnIndex = row.length;
      row.push(value);
      if (formula) {
        formulas.push({ address: encodeA1(rowIndex, columnIndex), formula });
      }
    }
  }
  trimEmptyTrailingCells(row);
  return row;
}
function extractFlatOdsCellValue(cellElement) {
  const text = extractOpenDocumentTextFromElement(cellElement);
  if (text) {
    return text;
  }
  return getXmlAttribute3(cellElement, "value") || getXmlAttribute3(cellElement, "date-value") || getXmlAttribute3(cellElement, "time-value") || getXmlAttribute3(cellElement, "boolean-value") || "";
}
function extractOpenDocumentTextFromElement(element) {
  const fragments = [];
  const visit = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      fragments.push(node.textContent || "");
      return;
    }
    if (!(node instanceof Element)) {
      return;
    }
    if (node.localName === "s") {
      fragments.push(" ".repeat(clampRepeat(getXmlAttribute3(node, "c"), 64)));
      return;
    }
    if (node.localName === "tab") {
      fragments.push("	");
      return;
    }
    if (node.localName === "line-break") {
      fragments.push("\n");
      return;
    }
    for (const child of Array.from(node.childNodes)) {
      visit(child);
    }
    if (node.localName === "p" || node.localName === "h") {
      fragments.push("\n");
    }
  };
  visit(element);
  return fragments.join("").replace(/\n+$/g, "").trim();
}
function getXmlAttribute3(element, localName) {
  const direct = element.getAttribute(localName);
  if (direct !== null) {
    return direct;
  }
  for (const attribute of Array.from(element.attributes)) {
    if (attribute.localName === localName) {
      return attribute.value;
    }
  }
  return null;
}
function clampRepeat(value, max) {
  const parsed = value ? Number.parseInt(value, 10) : 1;
  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }
  return Math.min(parsed, max);
}
function trimEmptyTrailingRows(rows) {
  while (rows.length > 0 && rows[rows.length - 1].every((cell) => cell === "")) {
    rows.pop();
  }
}
function trimEmptyTrailingCells(row) {
  while (row.length > 0 && row[row.length - 1] === "") {
    row.pop();
  }
}
function collectFormulaRows(sheet, range, encodeCell) {
  const formulas = [];
  for (let row = range.s.r; row <= range.e.r; row += 1) {
    for (let column = range.s.c; column <= range.e.c; column += 1) {
      const address = encodeCell({ r: row, c: column });
      const cell = sheet[address];
      if (cell?.f) {
        formulas.push({ address, formula: `=${cell.f}` });
      }
    }
  }
  return formulas;
}
function encodeA1(rowIndex, columnIndex) {
  let column = "";
  let value = columnIndex + 1;
  while (value > 0) {
    const remainder = (value - 1) % 26;
    column = String.fromCharCode(65 + remainder) + column;
    value = Math.floor((value - 1) / 26);
  }
  return `${column}${rowIndex + 1}`;
}
async function renderPptx(panel, arrayBuffer) {
  const container = document.createElement("div");
  container.className = "ofv-pptx-viewer";
  let insight;
  let zip;
  try {
    zip = await JSZip3.loadAsync(arrayBuffer);
    insight = await inspectPptxPresentation(zip);
    await renderPresentationInsight(panel, insight);
  } catch (error) {
    console.warn("PPTX structure insight extraction failed:", error);
  }
  panel.append(container);
  try {
    const { PptxViewer } = await import("@aiden0z/pptx-renderer");
    await withTimeout(PptxViewer.open(arrayBuffer, container), pptxRenderTimeoutMs());
    normalizePptxLayout(container);
  } catch (error) {
    container.replaceChildren();
    if (insight) {
      renderPptxTextFallback(container, insight);
      return;
    }
    if (zip) {
      renderPptxTextFallback(container, await inspectPptxPresentation(zip));
      return;
    }
    container.textContent = error instanceof Error && error.message.includes("timed out") ? "PPTX \u6E32\u67D3\u8D85\u65F6\uFF0C\u8BF7\u7A0D\u540E\u91CD\u8BD5\u6216\u8F6C\u6362\u4E3A PDF \u540E\u9884\u89C8\u3002" : "PPTX \u6E32\u67D3\u5931\u8D25\uFF0C\u8BF7\u68C0\u67E5\u6587\u4EF6\u662F\u5426\u635F\u574F\u3002";
  }
}
function renderPptxTextFallback(container, insight) {
  container.classList.add("ofv-presentation-slides");
  const slides = insight.slides.length > 0 ? insight.slides : [{ title: "PPTX", textCount: 0, imageCount: 0, notesCount: 0, hasTransition: false, animationCount: 0, sampleTexts: [] }];
  for (const [index, slide] of slides.entries()) {
    const article = document.createElement("article");
    article.className = "ofv-slide";
    article.dataset.slideIndex = String(index);
    const title = document.createElement("h4");
    title.textContent = slide.title || `Slide ${index + 1}`;
    article.append(title);
    const bodyTexts = slide.sampleTexts.length > 0 ? slide.sampleTexts : ["\u8BE5\u9875\u6CA1\u6709\u53EF\u63D0\u53D6\u6587\u672C\u3002"];
    for (const text of bodyTexts) {
      const paragraph = document.createElement("p");
      paragraph.textContent = text;
      article.append(paragraph);
    }
    container.append(article);
  }
}
async function withTimeout(promise, timeoutMs) {
  let timeoutId;
  try {
    return await Promise.race([
      promise,
      new Promise((_resolve, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error(`PPTX rendering timed out after ${timeoutMs}ms.`)), timeoutMs);
      })
    ]);
  } finally {
    if (timeoutId !== void 0) {
      window.clearTimeout(timeoutId);
    }
  }
}
function pptxRenderTimeoutMs() {
  const override = globalThis.__OFV_PPTX_RENDER_TIMEOUT_MS__;
  return typeof override === "number" && override > 0 ? override : DEFAULT_PPTX_RENDER_TIMEOUT_MS;
}
function normalizePptxLayout(container) {
  const slideCanvases = findPptxSlideCanvases(container);
  for (const slide of slideCanvases) {
    slide.style.backgroundColor = "#FFFFFF";
  }
  normalizePptxMirroredText(container);
}
function normalizePptxMirroredText(container) {
  const mirroredContainers = Array.from(container.querySelectorAll("div")).filter((element) => {
    const text = element.textContent?.trim();
    if (!text || element.children.length === 0) {
      return false;
    }
    const styleTransform = element.style.transform;
    return hasPptxMirrorTransform(styleTransform, "x") || hasPptxMirrorTransform(styleTransform, "y");
  });
  for (const element of mirroredContainers) {
    const flipX = hasPptxMirrorTransform(element.style.transform, "x");
    const flipY = hasPptxMirrorTransform(element.style.transform, "y");
    const targets = findPptxMirroredTextTargets(element);
    for (const target of targets) {
      counterMirrorPptxTextTarget(target, flipX, flipY);
    }
  }
}
function findPptxMirroredTextTargets(element) {
  const children = Array.from(element.children).filter((child) => child instanceof HTMLElement);
  const absoluteTextChildren = children.filter((child) => Boolean(child.textContent?.trim()) && child.style.position === "absolute");
  if (absoluteTextChildren.length > 0) {
    return absoluteTextChildren;
  }
  return children.filter((child) => Boolean(child.textContent?.trim()));
}
function hasPptxMirrorTransform(transform, axis) {
  if (!transform) {
    return false;
  }
  if (axis === "x" && /scaleX\(\s*-1\s*\)/i.test(transform)) {
    return true;
  }
  if (axis === "y" && /scaleY\(\s*-1\s*\)/i.test(transform)) {
    return true;
  }
  const matrix = transform.match(/matrix\(\s*([^,\s]+)\s*,\s*([^,\s]+)\s*,\s*([^,\s]+)\s*,\s*([^,\s]+)/i);
  if (!matrix) {
    return false;
  }
  const xScale = Number(matrix[1]);
  const yScale = Number(matrix[4]);
  return axis === "x" ? xScale < 0 : yScale < 0;
}
function counterMirrorPptxTextTarget(target, flipX, flipY) {
  const applied = target.dataset.ofvPptxCounterMirror ?? "";
  const transforms = [];
  if (flipX && !applied.includes("x")) {
    transforms.push("scaleX(-1)");
  }
  if (flipY && !applied.includes("y")) {
    transforms.push("scaleY(-1)");
  }
  if (transforms.length === 0) {
    return;
  }
  target.style.transform = `${target.style.transform || ""} ${transforms.join(" ")}`.trim();
  if (!target.style.transformOrigin) {
    target.style.transformOrigin = "center center";
  }
  target.dataset.ofvPptxCounterMirror = `${applied}${flipX ? "x" : ""}${flipY ? "y" : ""}`;
}
function findPptxSlideCanvases(container) {
  const slideWrappers = Array.from(container.querySelectorAll("div[data-slide-index]"));
  const candidates = slideWrappers.flatMap(
    (wrapper) => Array.from(wrapper.querySelectorAll("div")).filter(isPptxSlideCanvas)
  );
  if (candidates.length > 0) {
    return Array.from(new Set(candidates));
  }
  return Array.from(container.querySelectorAll("div")).filter(isPptxSlideCanvas);
}
function isPptxSlideCanvas(element) {
  return element.style.position === "relative" && parseCssPixelValue(element.style.width) > 0 && parseCssPixelValue(element.style.height) > 0;
}
async function renderOdp(panel, arrayBuffer) {
  const zip = await JSZip3.loadAsync(arrayBuffer);
  const content = zip.file("content.xml");
  if (!content) {
    panel.textContent = "\u672A\u89E3\u6790\u5230 ODP \u5185\u5BB9\u3002";
    return;
  }
  const xml = await content.async("text");
  const images = await extractZipImages(zip, /^Pictures\//);
  renderPresentationInsight(panel, inspectOpenDocumentPresentation(titleFromOdf(xml, "ODP \u6F14\u793A\u6587\u7A3F"), xml, images.length));
  renderOpenDocumentPresentation(panel, "ODP \u6F14\u793A\u6587\u7A3F", xml, images);
}
function renderOpenDocumentPresentationXml(panel, xml) {
  renderPresentationInsight(panel, inspectOpenDocumentPresentation("FODP \u6F14\u793A\u6587\u7A3F", xml, 0));
  renderOpenDocumentPresentation(panel, "FODP \u6F14\u793A\u6587\u7A3F", xml, []);
}
async function renderPackagedOfficePreview(panel, arrayBuffer, extension) {
  let zip;
  try {
    zip = await JSZip3.loadAsync(arrayBuffer);
  } catch {
    return false;
  }
  const entries = Object.values(zip.files).filter((entry) => !entry.dir);
  const hasEntry = (path) => entries.some((entry) => entry.name.toLowerCase() === path.toLowerCase());
  const contentXml = zip.file(/(^|\/)content\.xml$/i)[0];
  if (hasEntry("word/document.xml")) {
    await renderDocx(panel, arrayBuffer);
    return true;
  }
  if (hasEntry("xl/workbook.xml")) {
    await renderSheet(panel, arrayBuffer, extension);
    return true;
  }
  if (hasEntry("ppt/presentation.xml")) {
    await renderPptx(panel, arrayBuffer);
    return true;
  }
  if (contentXml) {
    const xml = await contentXml.async("text");
    if (/<office:spreadsheet\b|<table:table\b/i.test(xml)) {
      renderParsedSheets(panel, parseFlatOds(xml), `${extension.toUpperCase()} \u6587\u4EF6\u672A\u89E3\u6790\u5230\u8868\u683C\u3002`);
      return true;
    }
    if (/<office:presentation\b|<draw:page\b/i.test(xml)) {
      renderOpenDocumentPresentation(panel, `${extension.toUpperCase()} \u6F14\u793A\u6587\u7A3F`, xml, await extractZipImages(zip, /^Pictures\//));
      return true;
    }
    if (/<office:text\b|<text:p\b/i.test(xml)) {
      renderOpenDocumentXml(panel, `${extension.toUpperCase()} \u6587\u6863`, xml);
      return true;
    }
  }
  if (entries.some((entry) => /^index\//i.test(entry.name) || /\.iwa$/i.test(entry.name))) {
    renderOfficePackageStructure(
      panel,
      extension,
      entries.map((entry) => entry.name),
      "\u68C0\u6D4B\u5230 Apple iWork \u5305\u7ED3\u6784\u3002\u5F53\u524D\u89E3\u6790\u5305\u5185 plist \u5143\u6570\u636E\u5E76\u5C55\u793A IWA/\u8D44\u6E90\u7ED3\u6784\uFF1B\u6B63\u6587 IWA \u6570\u636E\u53EF\u540E\u7EED\u63A5\u5165\u4E13\u7528\u89E3\u6790\u5668\u589E\u5F3A\u3002",
      await extractIWorkMetadata(entries)
    );
    return true;
  }
  if (entries.length > 0) {
    renderOfficePackageStructure(
      panel,
      extension,
      entries.map((entry) => entry.name),
      "\u68C0\u6D4B\u5230 ZIP \u5305\u7ED3\u6784\uFF0C\u4F46\u672A\u53D1\u73B0\u6807\u51C6 OOXML/ODF \u5165\u53E3\u3002\u53EF\u540E\u7EED\u63A5\u5165\u5BF9\u5E94\u5382\u5546\u683C\u5F0F\u89E3\u6790\u5668\u6216\u670D\u52A1\u7AEF\u8F6C\u6362\u3002"
    );
    return true;
  }
  return false;
}
function renderOfficePackageStructure(panel, extension, entries, message, metadata) {
  const section = createSection("Office \u5305\u7ED3\u6784\u9884\u89C8");
  const note = document.createElement("p");
  note.className = "ofv-office-package-note";
  note.textContent = `.${extension} ${message}`;
  if (metadata && Object.keys(metadata).length > 0) {
    section.append(createIWorkMetadataSummary(metadata));
  }
  const list = document.createElement("ul");
  list.className = "ofv-office-package-list";
  for (const name of entries.slice(0, 120)) {
    const item = document.createElement("li");
    item.textContent = name;
    list.append(item);
  }
  if (entries.length > 120) {
    const item = document.createElement("li");
    item.textContent = `\u8FD8\u6709 ${entries.length - 120} \u4E2A\u6587\u4EF6\u672A\u5C55\u793A\u3002`;
    list.append(item);
  }
  section.append(note, list);
  panel.append(section);
}
async function extractIWorkMetadata(entries) {
  const metadataEntries = entries.filter((entry) => /^metadata\/.*\.plist$/i.test(entry.name) || /properties\.plist$/i.test(entry.name));
  const metadata = {};
  for (const entry of metadataEntries.slice(0, 6)) {
    const text = await entry.async("text").catch(() => "");
    if (!text || !/<plist[\s>]/i.test(text)) {
      continue;
    }
    const plist = parsePlistDict(text);
    mergeIWorkMetadata(metadata, plist);
  }
  return metadata;
}
function createIWorkMetadataSummary(metadata) {
  const wrapper = document.createElement("div");
  wrapper.className = "ofv-iwork-meta";
  const title = document.createElement("strong");
  title.textContent = "iWork \u5143\u6570\u636E";
  const grid = document.createElement("div");
  grid.className = "ofv-iwork-meta-grid";
  appendIWorkMeta(grid, "\u6807\u9898", metadata.title);
  appendIWorkMeta(grid, "\u4F5C\u8005", metadata.author);
  appendIWorkMeta(grid, "\u516C\u53F8", metadata.company);
  appendIWorkMeta(grid, "\u4E3B\u9898", metadata.subject);
  appendIWorkMeta(grid, "\u5173\u952E\u8BCD", metadata.keywords?.join(", "));
  appendIWorkMeta(grid, "\u521B\u5EFA\u65F6\u95F4", metadata.created);
  appendIWorkMeta(grid, "\u4FEE\u6539\u65F6\u95F4", metadata.modified);
  wrapper.append(title, grid);
  return wrapper;
}
function appendIWorkMeta(parent, label, value) {
  if (!value) {
    return;
  }
  const row = document.createElement("div");
  row.className = "ofv-meta-row";
  const key = document.createElement("span");
  key.textContent = label;
  const content = document.createElement("strong");
  content.textContent = value;
  row.append(key, content);
  parent.append(row);
}
function mergeIWorkMetadata(metadata, plist) {
  metadata.title ||= plistText(plist, ["Title", "title", "DocumentTitle", "SFDocumentTitle", "kMDItemTitle"]);
  metadata.author ||= plistText(plist, ["Author", "author", "Authors", "kMDItemAuthors", "creator"]);
  metadata.company ||= plistText(plist, ["Company", "company", "Organization"]);
  metadata.subject ||= plistText(plist, ["Subject", "subject", "Description", "comment"]);
  metadata.created ||= plistText(plist, ["CreationDate", "created", "kMDItemFSCreationDate"]);
  metadata.modified ||= plistText(plist, ["ModificationDate", "modified", "kMDItemFSContentChangeDate"]);
  metadata.keywords ||= plistArray(plist, ["Keywords", "keywords", "kMDItemKeywords"]);
}
function parsePlistDict(xml) {
  if (typeof DOMParser === "undefined") {
    return {};
  }
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    return {};
  }
  const dict = Array.from(doc.documentElement.children).find((child) => child.tagName === "dict");
  const value = dict ? parsePlistValue(dict) : void 0;
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function parsePlistValue(element) {
  switch (element.tagName) {
    case "dict": {
      const result = {};
      const children = Array.from(element.children);
      for (let index = 0; index < children.length; index++) {
        const key = children[index];
        if (key.tagName !== "key") {
          continue;
        }
        const value = children[index + 1];
        if (value) {
          result[key.textContent || ""] = parsePlistValue(value);
          index++;
        }
      }
      return result;
    }
    case "array":
      return Array.from(element.children).map(parsePlistValue);
    case "true":
      return true;
    case "false":
      return false;
    case "integer":
    case "real":
      return Number(element.textContent || 0);
    case "string":
    case "date":
    default:
      return element.textContent?.trim() || "";
  }
}
function plistText(plist, keys) {
  for (const key of keys) {
    const value = plist[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (Array.isArray(value)) {
      const text = value.filter((item) => typeof item === "string" && Boolean(item.trim())).join(", ");
      if (text) {
        return text;
      }
    }
  }
  return void 0;
}
function plistArray(plist, keys) {
  for (const key of keys) {
    const value = plist[key];
    if (Array.isArray(value)) {
      const items = value.filter((item) => typeof item === "string" && Boolean(item.trim()));
      if (items.length > 0) {
        return items;
      }
    }
    if (typeof value === "string" && value.trim()) {
      return value.split(/[,;]/).map((item) => item.trim()).filter(Boolean);
    }
  }
  return void 0;
}
function renderOpenDocumentPresentation(panel, title, xml, images) {
  const pages = xml.split(/<draw:page\b/).slice(1);
  const pageSources = pages.length > 0 ? pages : [xml];
  for (const [index, pageXml] of pageSources.entries()) {
    const section = createSection(`${title} ${index + 1}`);
    const body = document.createElement("div");
    body.className = "ofv-slide";
    const texts = extractOpenDocumentBlocks(pageXml);
    if (texts.length > 0) {
      hideSuccessfulSectionHeading(section);
      for (const text of texts) {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        body.append(paragraph);
      }
    } else {
      const empty = document.createElement("p");
      empty.textContent = "\u8FD9\u4E00\u9875\u6CA1\u6709\u53EF\u63D0\u53D6\u6587\u672C\u3002";
      body.append(empty);
    }
    for (const image of images.slice(index === 0 ? 0 : images.length, index === 0 ? images.length : images.length)) {
      const figure = document.createElement("figure");
      figure.className = "ofv-slide-image";
      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.name;
      const caption = document.createElement("figcaption");
      caption.textContent = image.name;
      figure.append(img, caption);
      body.append(figure);
    }
    section.append(body);
    panel.append(section);
  }
}
async function inspectPptxPresentation(zip) {
  const slideEntries = Object.values(zip.files).filter((entry) => !entry.dir && /^ppt\/slides\/slide\d+\.xml$/i.test(entry.name)).sort((a, b) => slideNumberFromPath(a.name) - slideNumberFromPath(b.name));
  const slides = [];
  let imageCount = 0;
  let notesCount = 0;
  let transitionCount = 0;
  let animationCount = 0;
  const layouts = /* @__PURE__ */ new Set();
  for (const entry of slideEntries) {
    const xml = await entry.async("text");
    const texts = extractOpenXmlText(xml);
    const rels = await readPptxRelationships(zip, entry.name);
    const layout = await resolvePptxSlideLayout(zip, entry.name, rels);
    if (layout) {
      layouts.add(layout);
    }
    const slideImageCount = countPptxSlideImages(xml, rels);
    const notesPath = resolvePptxRelationshipTarget(entry.name, rels.find((rel) => /\/notesSlide$/i.test(rel.type))?.target);
    const notesXml = notesPath ? await zip.file(notesPath)?.async("text") : void 0;
    const slideNotesCount = notesXml ? extractOpenXmlText(notesXml).length : 0;
    const hasTransition = /<p:transition\b/i.test(xml);
    const slideAnimationCount = countMatches3(xml, /<p:(?:anim|animEffect|animMotion|animRot|animScale|cmd|set)\b/gi);
    imageCount += slideImageCount;
    notesCount += slideNotesCount;
    transitionCount += hasTransition ? 1 : 0;
    animationCount += slideAnimationCount;
    slides.push({
      title: texts[0] || `Slide ${slides.length + 1}`,
      layout,
      textCount: texts.length,
      imageCount: slideImageCount,
      notesCount: slideNotesCount,
      hasTransition,
      animationCount: slideAnimationCount,
      sampleTexts: texts.slice(0, 4)
    });
  }
  return {
    title: "PPTX \u6F14\u793A\u6587\u7A3F\u7ED3\u6784",
    slideCount: slides.length,
    imageCount,
    notesCount,
    transitionCount,
    animationCount,
    layouts: Array.from(layouts),
    slides
  };
}
function inspectOpenDocumentPresentation(title, xml, totalImages) {
  const pages = xml.split(/<draw:page\b/).slice(1);
  const pageSources = pages.length > 0 ? pages : [xml];
  const slides = pageSources.map((pageXml, index) => {
    const texts = extractOpenDocumentBlocks(pageXml);
    const layout = matchXmlAttribute(pageXml, /presentation:class="([^"]+)"/i) || matchXmlAttribute(pageXml, /draw:style-name="([^"]+)"/i) || void 0;
    const imageCount = countMatches3(pageXml, /<draw:image\b/gi);
    const hasTransition = /presentation:transition-type=|presentation:transition-style=|smil:type=/i.test(pageXml);
    const animationCount = countMatches3(pageXml, /<anim:|<presentation:animations\b|<presentation:show-shape\b/gi);
    return {
      title: texts[0] || `Slide ${index + 1}`,
      layout,
      textCount: texts.length,
      imageCount,
      notesCount: countMatches3(pageXml, /<presentation:notes\b/gi),
      hasTransition,
      animationCount,
      sampleTexts: texts.slice(0, 4)
    };
  });
  const layouts = new Set(slides.map((slide) => slide.layout).filter(Boolean));
  return {
    title,
    slideCount: slides.length,
    imageCount: Math.max(totalImages, slides.reduce((sum, slide) => sum + slide.imageCount, 0)),
    notesCount: slides.reduce((sum, slide) => sum + slide.notesCount, 0),
    transitionCount: slides.filter((slide) => slide.hasTransition).length,
    animationCount: slides.reduce((sum, slide) => sum + slide.animationCount, 0),
    layouts: Array.from(layouts),
    slides
  };
}
async function renderPresentationInsight(panel, insight) {
  const summary = document.createElement("div");
  summary.className = "ofv-presentation-summary";
  summary.hidden = true;
  summary.setAttribute("aria-hidden", "true");
  summary.style.display = "none";
  summary.dataset.slideCount = String(insight.slideCount);
  summary.dataset.imageCount = String(insight.imageCount);
  summary.dataset.notesCount = String(insight.notesCount);
  summary.dataset.transitionCount = String(insight.transitionCount);
  summary.dataset.animationCount = String(insight.animationCount);
  const stats = [
    `${insight.slideCount} \u9875`,
    `${insight.layouts.length || 0} \u79CD\u5E03\u5C40`,
    `${insight.imageCount} \u5F20\u56FE\u7247`,
    `${insight.notesCount} \u6761\u5907\u6CE8`,
    `${insight.transitionCount} \u9875\u5207\u6362`,
    `${insight.animationCount} \u4E2A\u52A8\u753B\u6807\u8BB0`
  ];
  summary.append(createPresentationMetric(insight.title, stats.join(" \xB7 ")));
  if (insight.layouts.length > 0) {
    summary.append(createPresentationMetric("\u5E03\u5C40", insight.layouts.join("\u3001")));
  }
  panel.append(summary);
}
function createPresentationMetric(label, value) {
  const metric = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = label;
  const span = document.createElement("span");
  span.textContent = value;
  metric.append(strong, span);
  return metric;
}
async function readPptxRelationships(zip, partPath) {
  const relsPath = relationshipPathForPart(partPath);
  const xml = await zip.file(relsPath)?.async("text");
  if (!xml) {
    return [];
  }
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    return [];
  }
  return Array.from(doc.getElementsByTagNameNS(PPTX_REL_NS, "Relationship")).map((element) => ({
    id: element.getAttribute("Id") || "",
    type: element.getAttribute("Type") || "",
    target: element.getAttribute("Target") || ""
  }));
}
async function resolvePptxSlideLayout(zip, slidePath, rels) {
  const layoutRel = rels.find((rel) => /\/slideLayout$/i.test(rel.type));
  const layoutPath = resolvePptxRelationshipTarget(slidePath, layoutRel?.target);
  const xml = layoutPath ? await zip.file(layoutPath)?.async("text") : void 0;
  if (!xml) {
    return layoutPath?.split("/").pop()?.replace(/\.xml$/i, "");
  }
  return matchXmlAttribute(xml, /<p:cSld\b[^>]*name="([^"]+)"/i) || layoutPath?.split("/").pop()?.replace(/\.xml$/i, "");
}
function countPptxSlideImages(xml, rels) {
  const relImageIds = new Set(rels.filter((rel) => /\/image$/i.test(rel.type)).map((rel) => rel.id));
  const embeddedIds = [...xml.matchAll(/<a:blip\b[^>]*(?:r:embed|r:link)="([^"]+)"/gi)].map((match) => match[1]);
  if (embeddedIds.length > 0) {
    return embeddedIds.filter((id) => relImageIds.size === 0 || relImageIds.has(id)).length;
  }
  return relImageIds.size;
}
function relationshipPathForPart(partPath) {
  const parts = partPath.split("/");
  const fileName = parts.pop() || partPath;
  return `${parts.join("/")}/_rels/${fileName}.rels`;
}
function resolvePptxRelationshipTarget(sourcePath, target) {
  if (!target || /^[a-z]+:/i.test(target)) {
    return void 0;
  }
  if (target.startsWith("/")) {
    return target.slice(1);
  }
  const base = sourcePath.split("/").slice(0, -1);
  for (const segment of target.split("/")) {
    if (!segment || segment === ".") {
      continue;
    }
    if (segment === "..") {
      base.pop();
    } else {
      base.push(segment);
    }
  }
  return base.join("/");
}
function slideNumberFromPath(path) {
  return Number(path.match(/slide(\d+)\.xml$/i)?.[1] || "0");
}
function countMatches3(value, pattern) {
  return [...value.matchAll(pattern)].length;
}
function matchXmlAttribute(value, pattern) {
  const match = value.match(pattern);
  return match ? decodeXml2(match[1] || "") : null;
}
function titleFromOdf(xml, fallback) {
  return matchXmlAttribute(xml, /<office:meta[\s\S]*?<dc:title[^>]*>([\s\S]*?)<\/dc:title>/i) || fallback;
}
function isLegacyOfficeBinary(extension) {
  return ["doc", "dot", "wps", "xls", "xlt", "xlsb", "et", "ppt", "pps", "key", "dps"].includes(extension);
}
function legacyOfficeFormatLabel(extension) {
  if (extension === "doc" || extension === "dot" || extension === "wps") {
    return "Word Binary File Format";
  }
  if (extension === "xls" || extension === "xlt" || extension === "xlsb" || extension === "et") {
    return "Excel Binary File Format";
  }
  if (extension === "key") {
    return "Apple Keynote / legacy presentation package";
  }
  if (extension === "dps") {
    return "WPS Presentation legacy format";
  }
  return "PowerPoint Binary File Format";
}
function renderLegacyOfficeBinary(panel, extension, arrayBuffer, parseError) {
  const fragments = extractLegacyOfficeText(arrayBuffer);
  panel.replaceChildren();
  const section = createSection("Office \u8F6C\u6362\u63D0\u793A");
  section.classList.add("ofv-office-conversion");
  const format = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = `.${extension}`;
  format.append(
    strong,
    document.createTextNode(
      " \u5C5E\u4E8E\u65E7\u7248 Microsoft Office \u4E8C\u8FDB\u5236\u683C\u5F0F\uFF0C\u6D4F\u89C8\u5668\u5185\u65E0\u6CD5\u9AD8\u4FDD\u771F\u89E3\u6790\uFF1B\u5F53\u524D\u4EC5\u5C55\u793A\u53EF\u4FE1\u6587\u672C\u7247\u6BB5\u548C\u7ED3\u6784\u6307\u7EB9\uFF0C\u5B8C\u6574\u6392\u7248\u5EFA\u8BAE\u63A5\u5165 LibreOffice/OnlyOffice \u670D\u52A1\u7AEF\u8F6C\u6362\u4E3A PDF/HTML\u3002"
    )
  );
  const meta = document.createElement("dl");
  meta.className = "ofv-office-binary-meta";
  appendOfficeBinaryMeta(meta, "\u683C\u5F0F\u7C7B\u578B", legacyOfficeFormatLabel(extension));
  appendOfficeBinaryMeta(meta, "\u6587\u4EF6\u7ED3\u6784", hasOleSignature(arrayBuffer) ? "\u68C0\u6D4B\u5230 OLE Compound File \u7B7E\u540D" : "\u672A\u68C0\u6D4B\u5230\u6807\u51C6 OLE \u7B7E\u540D\uFF0C\u6309\u539F\u59CB\u4E8C\u8FDB\u5236\u5C1D\u8BD5\u63D0\u53D6");
  appendOfficeBinaryMeta(meta, "\u6587\u672C\u7247\u6BB5", `${fragments.length} \u6BB5`);
  if (parseError) {
    appendOfficeBinaryMeta(meta, "\u89E3\u6790\u72B6\u6001", parseError);
  }
  section.append(format, meta);
  if (fragments.length > 0) {
    const article = document.createElement("article");
    article.className = "ofv-document ofv-office-binary-fragments";
    const heading = document.createElement("h4");
    heading.textContent = "\u53EF\u8BFB\u6587\u672C\u7247\u6BB5";
    article.append(heading);
    for (const fragment of fragments.slice(0, 80)) {
      const paragraph = document.createElement("p");
      paragraph.textContent = fragment;
      article.append(paragraph);
    }
    section.append(article);
  } else {
    const empty = document.createElement("p");
    empty.className = "ofv-office-binary-empty";
    empty.textContent = "\u672A\u63D0\u53D6\u5230\u7A33\u5B9A\u53EF\u8BFB\u6587\u672C\u3002\u8BE5\u6587\u4EF6\u53EF\u80FD\u7ECF\u8FC7\u538B\u7F29\u3001\u52A0\u5BC6\uFF0C\u6216\u6587\u672C\u7F16\u7801\u65E0\u6CD5\u5728\u6D4F\u89C8\u5668\u7AEF\u53EF\u9760\u8BC6\u522B\uFF1B\u8BF7\u4F7F\u7528\u670D\u52A1\u7AEF LibreOffice/OnlyOffice \u8F6C\u6362\u540E\u9884\u89C8\u3002";
    section.append(empty);
  }
  panel.append(section);
}
function appendOfficeBinaryMeta(list, label, value) {
  const term = document.createElement("dt");
  term.textContent = label;
  const detail = document.createElement("dd");
  detail.textContent = value;
  list.append(term, detail);
}
function renderUnsupportedOffice(panel, extension) {
  const legacyBinary = /* @__PURE__ */ new Set(["doc", "dot", "wps", "ppt", "pps", "key", "dps"]);
  const message = legacyBinary.has(extension) ? "\u8BE5\u683C\u5F0F\u5C5E\u4E8E\u8001\u4E8C\u8FDB\u5236\u6216\u4E13\u6709\u683C\u5F0F\uFF0C\u6D4F\u89C8\u5668\u5185\u65E0\u6CD5\u53EF\u9760\u89E3\u6790\uFF1B\u5EFA\u8BAE\u63A5\u5165 LibreOffice/OnlyOffice \u670D\u52A1\u7AEF\u8F6C\u6362\u4E3A PDF/HTML \u540E\u9884\u89C8\u3002" : "\u8BE5\u683C\u5F0F\u901A\u5E38\u9700\u8981\u670D\u52A1\u7AEF\u8F6C\u6362\u6216\u4E13\u7528\u89E3\u6790\u5668\u624D\u80FD\u9AD8\u4FDD\u771F\u9884\u89C8\u3002";
  panel.replaceChildren();
  const section = createSection("Office \u57FA\u7840\u9884\u89C8");
  const format = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = `.${extension}`;
  format.append(strong, document.createTextNode(` \u5DF2\u8FDB\u5165 Office \u63D2\u4EF6\u3002${message}`));
  const support = document.createElement("p");
  support.textContent = "\u5F53\u524D\u7248\u672C\u4F18\u5148\u652F\u6301 docx\u3001rtf\u3001odt/fodt\u3001xlsx/xls/csv/ods\u3001pptx/ppsx\u3001odp/fodp \u7684\u57FA\u7840\u5185\u5BB9\u9884\u89C8\u3002";
  section.append(format, support);
  panel.append(section);
}
function normalizeOfficeError(error) {
  const message = error instanceof Error ? error.message : String(error || "");
  return message ? `\u89E3\u6790\u5668\u8FD4\u56DE\uFF1A${message}` : "\u89E3\u6790\u5668\u672A\u8FD4\u56DE\u5177\u4F53\u9519\u8BEF\u4FE1\u606F\u3002";
}
function extractLegacyOfficeText(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const fragments = [
    ...extractPrintableRuns(bytes).map((text) => ({ text, source: "ascii" })),
    ...extractUtf16Runs(bytes).map((text) => ({ text, source: "utf16" }))
  ].map(({ text, source }) => ({ text: normalizeLegacyText(text), source })).filter(({ text, source }) => isReadableLegacyTextFragment(text, source));
  const unique = [];
  const seen = /* @__PURE__ */ new Set();
  for (const { text: fragment } of fragments) {
    const key = fragment.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(fragment);
    }
  }
  return unique.slice(0, 160);
}
function isReadableLegacyTextFragment(fragment, source) {
  if (fragment.length > 600) {
    return false;
  }
  if (isLegacyOfficeMetadataNoise(fragment)) {
    return false;
  }
  if (!/[\p{L}\p{N}]/u.test(fragment)) {
    return false;
  }
  const chars = Array.from(fragment);
  const letters = chars.filter((char) => /\p{L}/u.test(char)).length;
  const digits = chars.filter((char) => /\p{N}/u.test(char)).length;
  const spaces = chars.filter((char) => /\s/u.test(char)).length;
  const asciiLetters = chars.filter((char) => /[A-Za-z]/.test(char)).length;
  const cjkLetters = chars.filter((char) => /[\u3400-\u9fff]/u.test(char)).length;
  const punctuation = chars.filter((char) => /[^\p{L}\p{N}\s]/u.test(char)).length;
  const alphaNumeric = letters + digits;
  const readableRatio = alphaNumeric / chars.length;
  const punctuationRatio = punctuation / chars.length;
  if (fragment.length < 4 || readableRatio < 0.55 || punctuationRatio > 0.24) {
    return false;
  }
  if (/([\p{L}\p{N}])\1{4,}/u.test(fragment)) {
    return false;
  }
  if (cjkLetters >= 2) {
    const suspiciousCjk = chars.filter((char) => isAsciiBytePairCjk(char)).length;
    if (suspiciousCjk / cjkLetters > 0.65) {
      return false;
    }
    if (isLikelyCjkHeading(fragment)) {
      return true;
    }
    if (punctuation > 0 && fragment.length < 12) {
      return false;
    }
    return cjkLetters >= 8 || cjkLetters >= 4 && spaces > 0;
  }
  if (asciiLetters >= 4) {
    if (punctuation > 0 && spaces === 0) {
      return false;
    }
    if (source === "ascii" && /^[A-Z]{2,8}$/.test(fragment)) {
      return false;
    }
    if (spaces > 0) {
      return letters >= 3;
    }
    return fragment.length >= 6;
  }
  if (spaces > 0 && letters >= 3) {
    return true;
  }
  return false;
}
function isLegacyOfficeMetadataNoise(fragment) {
  if (/[$�\uFFFD]/u.test(fragment)) {
    return true;
  }
  if (/^(?:Root Entry|WordDocument|Workbook|Book|SummaryInformation|DocumentSummaryInformation|CompObj|ObjectPool|Data|PowerPoint Document|Pictures)$/i.test(fragment)) {
    return true;
  }
  if (/\.(dotm?|docm?|pptx?|ppsx?|xlsm?|xlsx?)\b/i.test(fragment)) {
    return true;
  }
  if (/^(?:默认段落字体|普通表格|正文|标题|副标题|目录|页眉|页脚|批注|超链接)(?:\s*\d+)?$/.test(fragment)) {
    return true;
  }
  if (/\b(?:Normal|Default|Calibri|Times New Roman|WPS Office|Microsoft Office|KSOP?ProductBuildVer)\b/i.test(fragment)) {
    return true;
  }
  if (/^\d+(?:Table|List|Heading|Title|Style)$/i.test(fragment)) {
    return true;
  }
  if (/[{(]?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[})]?/i.test(fragment)) {
    return true;
  }
  if (/^[A-Z_]{3,}$/.test(fragment) || /^[A-Za-z]+(?:Information|Document|Storage|Stream|Table|Data|Pool|Obj|Props)$/i.test(fragment)) {
    return true;
  }
  return false;
}
function isLikelyCjkHeading(fragment) {
  return /^(?:标题|第[一二三四五六七八九十\d]+[章节条]|[一二三四五六七八九十\d]+[、.．])\s*[\p{L}\p{N}\s-]*$/u.test(fragment);
}
function isAsciiBytePairCjk(char) {
  const code = char.codePointAt(0) || 0;
  if (code < 13312 || code > 40959) {
    return false;
  }
  const low = code & 255;
  const high = code >> 8;
  return isPrintableAsciiByte(low) && isPrintableAsciiByte(high);
}
function isPrintableAsciiByte(value) {
  return value >= 32 && value <= 126;
}
function extractPrintableRuns(bytes) {
  const fragments = [];
  let current = "";
  for (const byte of bytes) {
    if (byte >= 32 && byte <= 126 || byte === 9) {
      current += String.fromCharCode(byte);
    } else {
      if (current.length >= 4) {
        fragments.push(current);
      }
      current = "";
    }
  }
  if (current.length >= 4) {
    fragments.push(current);
  }
  return fragments;
}
function extractUtf16Runs(bytes) {
  const fragments = [];
  let current = "";
  for (let index = 0; index < bytes.length - 1; index += 2) {
    if (looksLikeMisalignedAsciiUtf16(bytes[index], bytes[index + 1])) {
      if (current.length >= 3) {
        fragments.push(current);
      }
      current = "";
      continue;
    }
    const code = bytes[index] | bytes[index + 1] << 8;
    if (code >= 32 && code <= 55295 || code === 9) {
      current += String.fromCharCode(code);
    } else {
      if (current.length >= 3) {
        fragments.push(current);
      }
      current = "";
    }
  }
  if (current.length >= 3) {
    fragments.push(current);
  }
  return fragments;
}
function looksLikeMisalignedAsciiUtf16(lowByte, highByte) {
  return lowByte === 0 && (highByte >= 48 && highByte <= 57 || highByte >= 65 && highByte <= 90 || highByte >= 97 && highByte <= 122);
}
function normalizeLegacyText(value) {
  return value.replace(/[\u0000-\u001f]+/g, " ").replace(/\s+/g, " ").trim();
}
function hasOleSignature(arrayBuffer) {
  const signature = Array.from(new Uint8Array(arrayBuffer.slice(0, 8)));
  return signature.join(",") === "208,207,17,224,161,177,26,225";
}
async function extractZipImages(zip, pattern) {
  const images = [];
  for (const entry of Object.values(zip.files).filter((item) => !item.dir && pattern.test(item.name))) {
    const mimeType = mimeTypeFromPath(entry.name);
    if (!mimeType.startsWith("image/")) {
      continue;
    }
    images.push({
      name: entry.name.split("/").pop() || entry.name,
      src: `data:${mimeType};base64,${await entry.async("base64")}`
    });
  }
  return images;
}
function extractOpenXmlText(xml) {
  return [...xml.matchAll(/<a:t\b[^>]*>([\s\S]*?)<\/a:t>|<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)].map((match) => cleanOpenXmlText(decodeXml2(match[1] || match[2] || "")).trim()).filter(Boolean);
}
function extractWordParagraphs(xml) {
  const documentXml = parseWordXml(xml);
  if (documentXml) {
    const paragraphs = Array.from(documentXml.getElementsByTagName("*")).filter((element) => element.localName === "p").map((paragraph) => extractOpenXmlTextFromElement(paragraph).join("")).map((text) => text.trim()).filter(Boolean);
    if (paragraphs.length > 0) {
      return paragraphs;
    }
  }
  return extractWordParagraphsByRegex(xml);
}
function extractWordTextboxParagraphs(xml) {
  const paragraphs = extractWordTextboxParagraphsByRegex(xml);
  if (paragraphs.length > 0) {
    return paragraphs;
  }
  const documentXml = parseWordXml(xml);
  return documentXml ? Array.from(documentXml.getElementsByTagName("*")).filter((element) => element.localName === "txbxContent").flatMap(
    (textbox) => Array.from(textbox.getElementsByTagName("*")).filter((element) => element.localName === "p").map((paragraph) => extractOpenXmlTextFromElement(paragraph).join("")).map((text) => text.trim()).filter(Boolean)
  ) : [];
}
function parseWordXml(xml) {
  if (typeof DOMParser === "undefined") {
    return void 0;
  }
  try {
    const documentXml = new DOMParser().parseFromString(xml, "application/xml");
    if (documentXml.getElementsByTagName("parsererror").length > 0) {
      return void 0;
    }
    return documentXml;
  } catch {
    return void 0;
  }
}
function extractWordParagraphsByRegex(xml) {
  return [...xml.matchAll(/<w:p\b[\s\S]*?<\/w:p>/g)].map((match) => extractOpenXmlText(match[0]).join("")).map((text) => text.trim()).filter(Boolean);
}
function extractWordTextboxParagraphsByRegex(xml) {
  return [...xml.matchAll(/<w:txbxContent\b[\s\S]*?<\/w:txbxContent>/g)].flatMap((match) => {
    const textboxXml = ensureWordXmlWrapper(match[0]);
    const textboxDocument = parseWordXml(textboxXml);
    if (textboxDocument) {
      const paragraphs = Array.from(textboxDocument.getElementsByTagName("*")).filter((element) => element.localName === "p").map((paragraph) => extractOpenXmlTextFromElement(paragraph).join("")).map((text) => text.trim()).filter(Boolean);
      if (paragraphs.length > 0) {
        return paragraphs;
      }
    }
    return extractWordParagraphsByRegex(match[0]);
  });
}
function ensureWordXmlWrapper(xml) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <ofv:root
      xmlns:ofv="urn:open-file-viewer"
      xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
      xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
      xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
      xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
      xmlns:v="urn:schemas-microsoft-com:vml">
      ${xml}
    </ofv:root>`;
}
function extractOpenXmlTextFromElement(element) {
  return Array.from(element.getElementsByTagName("*")).filter((child) => child.localName === "t").map((child) => cleanOpenXmlText(child.textContent || "").trim()).filter(Boolean);
}
function cleanOpenXmlText(value) {
  return value.replace(/<\/?[A-Za-z][\w:.-]*(?:\s+[^<>]*)?>/g, "");
}
function dedupeParagraphs(paragraphs) {
  const result = [];
  const seen = /* @__PURE__ */ new Set();
  for (const paragraph of paragraphs) {
    const key = normalizePreviewText(paragraph);
    if (!key || key === normalizePreviewText(result[result.length - 1] || "") || seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(paragraph);
  }
  return result;
}
function filterCombinedTextboxParagraphs(documentParagraphs, textboxParagraphs) {
  const textboxKeys = textboxParagraphs.map((paragraph) => normalizePreviewText(paragraph)).filter(Boolean);
  if (textboxKeys.length < 2) {
    return documentParagraphs;
  }
  const combinedTextboxKey = textboxKeys.join("");
  const sortedTextboxKeys = [...textboxKeys].sort((a, b) => b.length - a.length);
  return documentParagraphs.filter((paragraph) => {
    const key = normalizePreviewText(paragraph);
    return key && key !== combinedTextboxKey && key !== `${combinedTextboxKey}${combinedTextboxKey}` && !isComposedOfTextboxParagraphs(key, sortedTextboxKeys);
  });
}
function isComposedOfTextboxParagraphs(value, textboxKeys) {
  let remaining = value;
  let matchedCount = 0;
  for (const key of textboxKeys) {
    if (!key || !remaining.includes(key)) {
      continue;
    }
    const before = remaining.length;
    remaining = remaining.split(key).join("");
    if (remaining.length !== before) {
      matchedCount += Math.floor((before - remaining.length) / key.length);
    }
  }
  return matchedCount >= 2 && remaining.length === 0;
}
function extractOpenDocumentBlocks(xml) {
  return [...xml.matchAll(/<(?:text:p|text:h)[^>]*>([\s\S]*?)<\/(?:text:p|text:h)>/g)].map((match) => stripXmlTags(match[1] || "")).map((text) => decodeXml2(text).trim()).filter(Boolean);
}
function stripXmlTags(value) {
  return value.replace(/<text:line-break\s*\/>/g, "\n").replace(/<text:tab\s*\/>/g, "	").replace(/<[^>]+>/g, "");
}
function rtfToText(rtf) {
  return rtf.replace(/\\'[0-9a-fA-F]{2}/g, "").replace(/\\par[d]?/g, "\n").replace(/\\tab/g, "	").replace(/\\[a-zA-Z]+\d* ?/g, "").replace(/[{}]/g, "").replace(/\n{3,}/g, "\n\n").trim();
}
async function readTextFromBuffer(arrayBuffer) {
  return decodeTextBuffer(arrayBuffer);
}
function hideSupplementalInfo3(element) {
  element.hidden = true;
  element.setAttribute("aria-hidden", "true");
  element.style.display = "none";
}
function hideSuccessfulSectionHeading(section) {
  const heading = section.querySelector("h3");
  if (heading) {
    hideSupplementalInfo3(heading);
  }
}
function mimeTypeFromPath(path) {
  const extension = path.split(".").pop()?.toLowerCase();
  const map = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    bmp: "image/bmp",
    svg: "image/svg+xml",
    webp: "image/webp"
  };
  return extension ? map[extension] || "application/octet-stream" : "application/octet-stream";
}
function decodeXml2(value) {
  return value.replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&apos;", "'");
}
function sanitizeHtml(html) {
  return DOMPurify2.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target"]
  });
}

// src/plugins/ofd.ts
import JSZip4 from "jszip";
function ofdPlugin() {
  return {
    name: "ofd",
    match(file) {
      return file.extension === "ofd" || file.mimeType === "application/ofd";
    },
    async render(ctx) {
      const panel = createPanel("ofv-ofd");
      const url = createObjectUrl(ctx.file);
      const isExternal = Boolean(ctx.file.url);
      ctx.viewport.append(panel);
      let zip;
      try {
        zip = await JSZip4.loadAsync(await readArrayBuffer(ctx.file));
      } catch (error) {
        panel.append(createOfdFailure(ctx.file, url, error));
        return {
          destroy() {
            panel.remove();
            revokeObjectUrl(url, isExternal);
          }
        };
      }
      const entries = Object.values(zip.files).filter((entry) => !entry.dir);
      const textFragments = [];
      try {
        for (const entry of entries.filter((item) => item.name.endsWith(".xml")).slice(0, 40)) {
          const xml = await entry.async("text");
          const matches = [...xml.matchAll(/>([^<>]{2,})</g)].map((match) => match[1]?.trim()).filter(Boolean);
          textFragments.push(...matches);
        }
      } catch (error) {
        panel.append(createOfdFailure(ctx.file, url, error));
        return {
          destroy() {
            panel.remove();
            revokeObjectUrl(url, isExternal);
          }
        };
      }
      const context = await readOfdContext(entries);
      const pages = await readOfdPages(entries, context);
      let zoom = 1;
      let rotation = 0;
      const applyZoom = () => {
        panel.style.setProperty("--ofv-ofd-zoom", formatOfdCssNumber(zoom));
        ctx.toolbar?.setZoom(zoom);
      };
      const applyRotation = () => {
        const normalizedRotation = (rotation % 360 + 360) % 360;
        panel.style.setProperty("--ofv-ofd-rotation", `${normalizedRotation}deg`);
        panel.classList.toggle("is-ofd-rotated-sideways", normalizedRotation === 90 || normalizedRotation === 270);
      };
      if (pages.length > 0) {
        const pagesWrap = document.createElement("div");
        pagesWrap.className = "ofv-ofd-pages";
        for (const page of pages) {
          pagesWrap.append(renderOfdPage(page));
        }
        panel.append(pagesWrap);
        applyZoom();
        applyRotation();
      }
      if (pages.length === 0) {
        const content = document.createElement("pre");
        content.className = "ofv-text-block";
        content.textContent = textFragments.slice(0, 300).join("\n") || "\u672A\u63D0\u53D6\u5230\u53EF\u8BFB\u6587\u672C\u3002";
        panel.append(content);
      }
      return {
        canCommand(command) {
          return pages.length > 0 && (command === "zoom-in" || command === "zoom-out" || command === "zoom-reset" || command === "rotate-right" || command === "rotate-left");
        },
        command(command) {
          if (pages.length === 0) {
            return false;
          }
          if (command === "zoom-in") {
            zoom = Math.min(4, zoom + 0.15);
            applyZoom();
            return true;
          }
          if (command === "zoom-out") {
            zoom = Math.max(0.25, zoom - 0.15);
            applyZoom();
            return true;
          }
          if (command === "zoom-reset") {
            zoom = 1;
            rotation = 0;
            applyZoom();
            applyRotation();
            return true;
          }
          if (command === "rotate-right") {
            rotation += 90;
            applyRotation();
            return true;
          }
          if (command === "rotate-left") {
            rotation -= 90;
            applyRotation();
            return true;
          }
          return false;
        },
        destroy() {
          ctx.toolbar?.setZoom(void 0);
          panel.remove();
          revokeObjectUrl(url, isExternal);
        }
      };
    }
  };
}
async function readOfdPages(entries, context) {
  const pages = [];
  const pageEntries = entries.filter((entry) => /(^|\/)Pages\/Page_[^/]+\/Content\.xml$/i.test(entry.name) || /(^|\/)Page_[^/]+\/Content\.xml$/i.test(entry.name)).slice(0, 80);
  for (const entry of pageEntries) {
    const xml = await entry.async("text");
    const templates = await readPageTemplates(xml, context, entries);
    const page = parseOfdPage(entry.name, xml, context.images, context.fonts, templates, context.pageSize);
    if (page.texts.length > 0 || page.paths.length > 0 || page.lines.length > 0 || page.images.length > 0) {
      pages.push(page);
    }
  }
  return pages;
}
async function readPageTemplates(xml, context, entries) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    return [];
  }
  const templateIds = Array.from(doc.getElementsByTagName("*")).filter((element) => element.localName === "Template").map((element) => getOfdAttribute(element, "TemplateID") || getOfdAttribute(element, "ID")).filter((id) => Boolean(id));
  const templates = [];
  for (const id of templateIds) {
    const path = context.templates.get(id);
    const entry = path ? findOfdEntry(entries, path) : void 0;
    if (entry) {
      templates.push(await entry.async("text"));
    }
  }
  return templates;
}
function parseOfdPage(name, xml, images, fonts, templateXmls = [], defaultPageSize) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    return { name, width: 210, height: 297, texts: [], paths: [], lines: [], images: [] };
  }
  const pageSize = parseOfdPageSize(doc, defaultPageSize);
  const templatePages = templateXmls.map((templateXml) => {
    const templateDoc = new DOMParser().parseFromString(templateXml, "application/xml");
    return templateDoc.querySelector("parsererror") ? emptyOfdPageContent() : parseOfdPageContent(templateDoc, images, fonts);
  });
  const pageContent = parseOfdPageContent(doc, images, fonts);
  const texts = [...templatePages.flatMap((page) => page.texts), ...pageContent.texts];
  const paths = [...templatePages.flatMap((page) => page.paths), ...pageContent.paths];
  const lines = [...templatePages.flatMap((page) => page.lines), ...pageContent.lines];
  const imageObjects = [...templatePages.flatMap((page) => page.images), ...pageContent.images];
  if (pageSize.explicit) {
    return { name, width: pageSize.width, height: pageSize.height, texts, paths, lines, images: imageObjects };
  }
  const bounds = createOfdBounds(texts, paths, lines, imageObjects);
  const width = Math.max(pageSize.width, ...bounds.map((item) => item.x + item.width + 12));
  const height = Math.max(pageSize.height, ...bounds.map((item) => item.y + item.height + 12));
  return { name, width, height, texts, paths, lines, images: imageObjects };
}
function parseOfdPageContent(doc, images, fonts) {
  const textObjects = Array.from(doc.getElementsByTagName("*")).filter((element) => element.localName === "TextObject");
  const texts = textObjects.flatMap((element) => parseOfdTextObject(element, fonts));
  const paths = Array.from(doc.getElementsByTagName("*")).filter((element) => element.localName === "PathObject").flatMap((element) => parseOfdPathObject(element));
  const lines = Array.from(doc.getElementsByTagName("*")).filter((element) => element.localName === "LineObject").flatMap((element) => parseOfdLineObject(element));
  const imageObjects = Array.from(doc.getElementsByTagName("*")).filter((element) => element.localName === "ImageObject").flatMap((element) => parseOfdImageObject(element, images));
  return { texts, paths, lines, images: imageObjects };
}
function emptyOfdPageContent() {
  return { texts: [], paths: [], lines: [], images: [] };
}
function createOfdBounds(texts, paths, lines, imageObjects) {
  return [
    ...texts.map((item) => ({ x: item.x, y: item.y, width: item.width, height: item.height })),
    ...paths.map((item) => ({ x: item.x, y: item.y, width: item.width, height: item.height })),
    ...lines.map((item) => ({
      x: Math.min(item.x1, item.x2),
      y: Math.min(item.y1, item.y2),
      width: Math.abs(item.x2 - item.x1),
      height: Math.abs(item.y2 - item.y1)
    })),
    ...imageObjects.map((item) => ({ x: item.x, y: item.y, width: item.width, height: item.height }))
  ];
}
function parseOfdTextObject(element, fonts) {
  const boundary = parseBoundary(getOfdAttribute(element, "Boundary"));
  const size = finiteNumber2(getOfdAttribute(element, "Size"), Math.max(4, boundary.height || 5));
  const color = parseOfdColor(element, "#111827");
  const weight = finiteNumber2(getOfdAttribute(element, "Weight"), 400) >= 600 ? "700" : "400";
  const fontFamily = fontStackForOfdFont(fonts.get(getOfdAttribute(element, "Font") || ""));
  const objectLetterSpacing = getOfdAttribute(element, "DeltaX") ? 0.5 : void 0;
  const textCodes = Array.from(element.getElementsByTagName("*")).filter((child) => child.localName === "TextCode");
  if (textCodes.length === 0) {
    return [];
  }
  return textCodes.flatMap((code) => {
    const x = boundary.x + finiteNumber2(getOfdAttribute(code, "X"), 0);
    const y = boundary.y + finiteNumber2(getOfdAttribute(code, "Y"), 0);
    const text = code.textContent?.trim() || "";
    const deltaX = parseOfdDeltaX(getOfdAttribute(code, "DeltaX"));
    const align = deltaX ? "start" : inferOfdTextAlign(text, boundary);
    const deltaY = getOfdAttribute(code, "DeltaY");
    if (deltaY && text.length > 1) {
      const step = parseOfdDeltaStep(deltaY, size);
      return Array.from(text).map((char, index) => ({
        text: char,
        x,
        y: y + index * step,
        width: boundary.width,
        height: boundary.height,
        size,
        color,
        weight,
        fontFamily,
        letterSpacing: objectLetterSpacing,
        vertical: true,
        align
      }));
    }
    return [
      {
        text,
        x,
        y,
        width: boundary.width,
        height: boundary.height,
        size,
        color,
        weight,
        fontFamily,
        letterSpacing: deltaX ? void 0 : objectLetterSpacing,
        deltaX,
        align
      }
    ];
  }).filter((item) => item.text);
}
function parseOfdPathObject(element) {
  const boundary = parseBoundary(getOfdAttribute(element, "Boundary"));
  const ctm = parseOfdCtm(getOfdAttribute(element, "CTM"));
  const commands = Array.from(element.getElementsByTagName("*")).filter(
    (child) => child.localName === "AbbreviatedData" || child.localName === "PathData"
  );
  const raw = commands.map((child) => child.textContent || "").join(" ").trim();
  if (!raw) {
    return [];
  }
  return [
    {
      d: normalizeOfdPathData(raw),
      x: boundary.x,
      y: boundary.y,
      width: boundary.width,
      height: boundary.height,
      stroke: parseOfdColor(element, "#111827", "StrokeColor"),
      fill: parseOfdFill(element),
      strokeWidth: finiteNumber2(getOfdAttribute(element, "LineWidth"), 1),
      transform: createOfdPathTransform(boundary.x, boundary.y, ctm)
    }
  ];
}
function parseOfdLineObject(element) {
  const boundary = parseBoundary(getOfdAttribute(element, "Boundary"));
  const start = parsePoint(getOfdAttribute(element, "StartPoint"), { x: 0, y: 0 });
  const end = parsePoint(getOfdAttribute(element, "EndPoint"), {
    x: boundary.width,
    y: boundary.height
  });
  return [
    {
      x1: boundary.x + start.x,
      y1: boundary.y + start.y,
      x2: boundary.x + end.x,
      y2: boundary.y + end.y,
      stroke: parseOfdColor(element, "#111827"),
      strokeWidth: finiteNumber2(getOfdAttribute(element, "LineWidth"), 1)
    }
  ];
}
function parseOfdImageObject(element, images) {
  const boundary = parseBoundary(getOfdAttribute(element, "Boundary"));
  const resourceId = getOfdAttribute(element, "ResourceID") || getOfdAttribute(element, "ResourceId") || "";
  return [
    {
      x: boundary.x,
      y: boundary.y,
      width: boundary.width || 32,
      height: boundary.height || 32,
      resourceId,
      href: images.get(resourceId)
    }
  ];
}
function renderOfdPage(page) {
  const figure = document.createElement("figure");
  figure.className = "ofv-ofd-page";
  figure.style.setProperty("--ofv-ofd-page-width", `${formatOfdCssNumber(page.width)}mm`);
  figure.style.setProperty("--ofv-ofd-page-height", `${formatOfdCssNumber(page.height)}mm`);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${page.width} ${page.height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", page.name);
  const paper = document.createElementNS(svg.namespaceURI, "rect");
  paper.setAttribute("x", "0");
  paper.setAttribute("y", "0");
  paper.setAttribute("width", String(page.width));
  paper.setAttribute("height", String(page.height));
  paper.setAttribute("fill", "white");
  svg.append(paper);
  for (const item of page.images) {
    if (item.href) {
      const image = document.createElementNS(svg.namespaceURI, "image");
      image.setAttribute("x", String(item.x));
      image.setAttribute("y", String(item.y));
      image.setAttribute("width", String(item.width));
      image.setAttribute("height", String(item.height));
      image.setAttribute("href", item.href);
      image.setAttribute("preserveAspectRatio", "xMidYMid meet");
      svg.append(image);
    } else {
      const placeholder = document.createElementNS(svg.namespaceURI, "rect");
      placeholder.setAttribute("x", String(item.x));
      placeholder.setAttribute("y", String(item.y));
      placeholder.setAttribute("width", String(item.width));
      placeholder.setAttribute("height", String(item.height));
      placeholder.setAttribute("fill", "#f8fafc");
      placeholder.setAttribute("stroke", "#94a3b8");
      placeholder.setAttribute("stroke-dasharray", "4 3");
      svg.append(placeholder);
    }
  }
  for (const item of page.paths) {
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", item.d);
    path.setAttribute("transform", item.transform);
    path.setAttribute("fill", item.fill);
    path.setAttribute("stroke", item.stroke);
    path.setAttribute("stroke-width", String(item.strokeWidth));
    svg.append(path);
  }
  for (const item of page.lines) {
    const line = document.createElementNS(svg.namespaceURI, "line");
    line.setAttribute("x1", String(item.x1));
    line.setAttribute("y1", String(item.y1));
    line.setAttribute("x2", String(item.x2));
    line.setAttribute("y2", String(item.y2));
    line.setAttribute("stroke", item.stroke);
    line.setAttribute("stroke-width", String(item.strokeWidth));
    line.setAttribute("stroke-linecap", "round");
    svg.append(line);
  }
  for (const item of page.texts) {
    const text = document.createElementNS(svg.namespaceURI, "text");
    text.setAttribute("x", String(item.align === "end" ? item.x + item.width : item.x));
    text.setAttribute("y", String(item.y));
    text.setAttribute("font-size", String(item.size));
    text.setAttribute("fill", item.color);
    text.setAttribute("font-weight", item.weight);
    text.setAttribute("font-family", item.fontFamily);
    if (item.letterSpacing !== void 0) {
      text.setAttribute("letter-spacing", String(item.letterSpacing));
    }
    if (item.deltaX && item.deltaX.length > 0 && item.align !== "end") {
      const chars = Array.from(item.text);
      let x = item.x;
      for (let index = 0; index < chars.length; index += 1) {
        const span = document.createElementNS(svg.namespaceURI, "tspan");
        span.setAttribute("x", String(x));
        span.setAttribute("y", String(item.y));
        if (index < chars.length - 1) {
          x += item.deltaX[Math.min(index, item.deltaX.length - 1)] || item.size;
        }
        span.textContent = chars[index];
        text.append(span);
      }
    } else {
      if (item.align === "end") {
        text.setAttribute("text-anchor", "end");
      }
      text.textContent = item.text;
    }
    svg.append(text);
  }
  figure.append(svg);
  return figure;
}
async function readOfdContext(entries) {
  const images = await readOfdImages(entries);
  const fonts = await readOfdFonts(entries);
  const { templates, pageSize } = await readOfdDocumentInfo(entries);
  return { images, templates, fonts, pageSize };
}
async function readOfdFonts(entries) {
  const fonts = /* @__PURE__ */ new Map();
  for (const entry of entries.filter((item) => /(?:^|\/)(?:DocumentRes|PublicRes)\.xml$/i.test(item.name))) {
    const xml = await entry.async("text");
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    if (doc.querySelector("parsererror")) {
      continue;
    }
    for (const font of Array.from(doc.getElementsByTagName("*")).filter((element) => element.localName === "Font")) {
      const id = getOfdAttribute(font, "ID");
      const name = getOfdAttribute(font, "FontName") || getOfdAttribute(font, "FamilyName");
      if (id && name) {
        fonts.set(id, name.trim());
      }
    }
  }
  return fonts;
}
async function readOfdImages(entries) {
  const images = /* @__PURE__ */ new Map();
  for (const entry of entries.filter((item) => /\.(?:png|jpe?g|gif|bmp|webp)$/i.test(item.name)).slice(0, 80)) {
    const id = entry.name.split("/").pop()?.replace(/\.[^.]+$/, "") || entry.name;
    const mimeType = mimeTypeFromPath2(entry.name);
    if (!mimeType.startsWith("image/")) {
      continue;
    }
    const base64 = await entry.async("base64");
    const href = `data:${mimeType};base64,${base64}`;
    images.set(id, href);
    images.set(entry.name, href);
    images.set(entry.name.split("/").pop() || entry.name, href);
  }
  for (const entry of entries.filter((item) => /(?:^|\/)(?:DocumentRes|PublicRes)\.xml$/i.test(item.name))) {
    const xml = await entry.async("text");
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    if (doc.querySelector("parsererror")) {
      continue;
    }
    const baseLoc = getOfdAttribute(doc.documentElement, "BaseLoc") || "";
    const resourceDir = joinOfdPath(directoryName2(entry.name), baseLoc);
    for (const media of Array.from(doc.getElementsByTagName("*")).filter((element) => element.localName === "MultiMedia")) {
      const id = getOfdAttribute(media, "ID");
      const mediaFile = findOfdChild(media, "MediaFile")?.textContent?.trim();
      if (!id || !mediaFile) {
        continue;
      }
      const imageEntry = findOfdEntry(entries, joinOfdPath(resourceDir, mediaFile)) || findOfdEntry(entries, mediaFile);
      const href = imageEntry ? images.get(imageEntry.name) || images.get(imageEntry.name.split("/").pop() || imageEntry.name) : void 0;
      if (href) {
        images.set(id, href);
      }
    }
  }
  return images;
}
async function readOfdDocumentInfo(entries) {
  const templates = /* @__PURE__ */ new Map();
  let pageSize;
  for (const entry of entries.filter((item) => /(?:^|\/)Document\.xml$/i.test(item.name))) {
    const xml = await entry.async("text");
    const doc = new DOMParser().parseFromString(xml, "application/xml");
    if (doc.querySelector("parsererror")) {
      continue;
    }
    const documentDir = directoryName2(entry.name);
    const physicalBox = Array.from(doc.getElementsByTagName("*")).find((element) => element.localName === "PageArea")?.getElementsByTagName("*");
    const pageAreaBox = physicalBox ? Array.from(physicalBox).find((element) => element.localName === "PhysicalBox") : void 0;
    if (pageAreaBox?.textContent) {
      const box = parseBoundary(pageAreaBox.textContent);
      if (box.width > 0 && box.height > 0) {
        pageSize = { width: box.width, height: box.height };
      }
    }
    for (const template of Array.from(doc.getElementsByTagName("*")).filter((element) => element.localName === "TemplatePage")) {
      const id = getOfdAttribute(template, "ID");
      const baseLoc = getOfdAttribute(template, "BaseLoc");
      if (id && baseLoc) {
        templates.set(id, joinOfdPath(documentDir, baseLoc));
      }
    }
  }
  return { templates, pageSize };
}
function parseOfdPageSize(doc, defaultPageSize) {
  if (defaultPageSize) {
    return { ...defaultPageSize, explicit: true };
  }
  const physicalBox = Array.from(doc.getElementsByTagName("*")).find((element) => element.localName === "PhysicalBox");
  if (physicalBox?.textContent) {
    const box = parseBoundary(physicalBox.textContent);
    if (box.width > 0 && box.height > 0) {
      return { width: box.width, height: box.height, explicit: true };
    }
  }
  return { width: 210, height: 297, explicit: false };
}
function parseOfdColor(element, fallback, preferredLocalName = "FillColor") {
  const colorElement = findOfdChild(element, preferredLocalName) || findOfdChild(element, "StrokeColor") || findOfdChild(element, "FillColor");
  const value = colorElement ? getOfdAttribute(colorElement, "Value") : null;
  if (!value) {
    return fallback;
  }
  const parts = value.trim().split(/\s+/).map((part) => Number(part));
  if (parts.length >= 3 && parts.every((part) => Number.isFinite(part))) {
    return `rgb(${parts.slice(0, 3).map((part) => Math.max(0, Math.min(255, part))).join(" ")})`;
  }
  return fallback;
}
function parseOfdFill(element) {
  const fillElement = findOfdChild(element, "FillColor");
  return fillElement ? parseOfdColor(element, "transparent", "FillColor") : "transparent";
}
function findOfdChild(element, localName) {
  return Array.from(element.children).find((child) => child.localName === localName);
}
function parsePoint(value, fallback) {
  const parts = (value || "").trim().split(/\s+/).map((part) => Number(part));
  return {
    x: Number.isFinite(parts[0]) ? parts[0] : fallback.x,
    y: Number.isFinite(parts[1]) ? parts[1] : fallback.y
  };
}
function normalizeOfdPathData(value) {
  return value.replace(/\bM\s+/gi, "M ").replace(/\bL\s+/gi, "L ").replace(/\bC\s+/gi, "C ").replace(/\bQ\s+/gi, "Q ").replace(/\bA\s+/gi, "A ").replace(/\bB\s+/gi, "C ").replace(/\bZ\b/gi, "Z").replace(/\s+/g, " ").trim();
}
function parseOfdCtm(value) {
  const parts = (value || "").trim().split(/\s+/).map((part) => Number(part));
  if (parts.length !== 6 || parts.some((part) => !Number.isFinite(part))) {
    return void 0;
  }
  return parts;
}
function createOfdPathTransform(x, y, ctm) {
  if (!ctm) {
    return `translate(${x} ${y})`;
  }
  const [a, b, c, d, e, f] = ctm;
  return `translate(${x} ${y}) matrix(${a} ${b} ${c} ${d} ${e} ${f})`;
}
function parseOfdDeltaStep(value, fallback) {
  const numbers = value.match(/-?\d+(?:\.\d+)?/g)?.map((part) => Number(part)).filter((part) => Number.isFinite(part)) || [];
  return numbers.length > 0 ? numbers[numbers.length - 1] : fallback;
}
function parseOfdDeltaX(value) {
  if (!value) {
    return void 0;
  }
  const parts = value.match(/[a-z]+|-?\d+(?:\.\d+)?/gi) || [];
  const deltas = [];
  for (let index = 0; index < parts.length; index += 1) {
    const token = parts[index];
    if (/^g$/i.test(token)) {
      const count = Number(parts[index + 1]);
      const step = Number(parts[index + 2]);
      if (Number.isFinite(count) && Number.isFinite(step)) {
        deltas.push(...Array.from({ length: Math.max(0, Math.floor(count)) }, () => step));
      }
      index += 2;
      continue;
    }
    const numeric = Number(token);
    if (Number.isFinite(numeric)) {
      deltas.push(numeric);
    }
  }
  return deltas.length > 0 ? deltas : void 0;
}
function fontStackForOfdFont(fontName) {
  const normalized = (fontName || "").trim().toLowerCase();
  if (normalized.includes("courier")) {
    return '"Courier New", Courier, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
  }
  if (normalized.includes("kaiti") || normalized.includes("kai") || normalized.includes("\u6977")) {
    return '"STKaiti", "Kaiti SC", "KaiTi", "\u6977\u4F53", serif';
  }
  if (normalized.includes("simsun") || normalized.includes("simsong") || normalized.includes("song") || normalized.includes("\u5B8B")) {
    return '"SimSong", "Songti SC", "STSong", SimSun, "\u5B8B\u4F53", serif';
  }
  if (normalized.includes("hei") || normalized.includes("\u9ED1")) {
    return '"PingFang SC", "Microsoft YaHei", SimHei, sans-serif';
  }
  return '"SimSong", "Songti SC", "STSong", SimSun, "Noto Serif CJK SC", serif';
}
function inferOfdTextAlign(text, boundary) {
  const normalized = text.trim();
  if (!/^[¥￥]?\d+(?:\.\d+)?%?$/.test(normalized)) {
    return "start";
  }
  if (boundary.x >= 75 || boundary.width <= 30) {
    return "end";
  }
  return "start";
}
function findOfdEntry(entries, path) {
  const normalized = normalizeOfdPath(path);
  return entries.find((entry) => normalizeOfdPath(entry.name) === normalized || normalizeOfdPath(entry.name).endsWith(`/${normalized}`));
}
function joinOfdPath(...parts) {
  const joined = parts.filter(Boolean).join("/");
  const segments = [];
  for (const segment of joined.split("/")) {
    if (!segment || segment === ".") {
      continue;
    }
    if (segment === "..") {
      segments.pop();
      continue;
    }
    segments.push(segment);
  }
  return segments.join("/");
}
function directoryName2(path) {
  const normalized = normalizeOfdPath(path);
  const index = normalized.lastIndexOf("/");
  return index >= 0 ? normalized.slice(0, index) : "";
}
function normalizeOfdPath(path) {
  return path.replace(/\\/g, "/").replace(/^\/+/, "").replace(/\/+/g, "/");
}
function mimeTypeFromPath2(path) {
  const extension = path.split(".").pop()?.toLowerCase();
  const map = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    bmp: "image/bmp",
    webp: "image/webp"
  };
  return extension ? map[extension] || "application/octet-stream" : "application/octet-stream";
}
function parseBoundary(value) {
  const parts = (value || "").trim().split(/\s+/).map((part) => Number(part));
  return {
    x: Number.isFinite(parts[0]) ? parts[0] : 0,
    y: Number.isFinite(parts[1]) ? parts[1] : 0,
    width: Number.isFinite(parts[2]) ? parts[2] : 0,
    height: Number.isFinite(parts[3]) ? parts[3] : 0
  };
}
function getOfdAttribute(element, localName) {
  const direct = element.getAttribute(localName);
  if (direct !== null) {
    return direct;
  }
  for (const attribute of Array.from(element.attributes)) {
    if (attribute.localName === localName) {
      return attribute.value;
    }
  }
  return null;
}
function finiteNumber2(value, fallback) {
  const parsed = value === null ? Number.NaN : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
function formatOfdCssNumber(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}
function createOfdFailure(file, url, error) {
  if (isEncryptedError(error)) {
    return createEncryptedFallback(file, url, {
      title: "OFD \u6587\u4EF6\u5DF2\u52A0\u5BC6\uFF0C\u65E0\u6CD5\u5728\u7EBF\u9884\u89C8",
      message: "\u8BF7\u4E0B\u8F7D\u540E\u4F7F\u7528\u672C\u5730 OFD \u9605\u8BFB\u5668\u8F93\u5165\u5BC6\u7801\u6253\u5F00\uFF0C\u6216\u4E0A\u4F20\u89E3\u5BC6\u540E\u7684 OFD \u6587\u4EF6\u3002",
      action: "\u4E0B\u8F7D OFD"
    });
  }
  return createOfdFallback(file.name, url, normalizeOfdError(error));
}
function createOfdFallback(fileName, url, detail) {
  const fallback = document.createElement("div");
  fallback.className = "ofv-fallback";
  const title = document.createElement("strong");
  title.textContent = "OFD \u89E3\u6790\u5931\u8D25";
  const meta = document.createElement("span");
  meta.textContent = `${detail}\u3002\u53EF\u4E0B\u8F7D ${fileName} \u540E\u4F7F\u7528\u672C\u5730 OFD \u9605\u8BFB\u5668\u67E5\u770B\u3002`;
  const download = document.createElement("a");
  download.href = url;
  download.download = fileName;
  download.textContent = "\u4E0B\u8F7D OFD";
  fallback.append(title, meta, download);
  return fallback;
}
function normalizeOfdError(error) {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "\u6587\u4EF6\u53EF\u80FD\u5DF2\u635F\u574F\uFF0C\u6216\u4E0D\u662F\u6709\u6548\u7684 OFD \u5305";
}

// src/plugins/archive.ts
import JSZip5 from "jszip";
import pako from "pako";
var archiveExtensions = /* @__PURE__ */ new Set(["zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"]);
var archiveMimeTypes = /* @__PURE__ */ new Set([
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.rar",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "application/x-tar",
  "application/gzip",
  "application/x-gzip",
  "application/x-bzip2",
  "application/x-xz"
]);
var archiveMimeFormatMap = {
  "application/zip": "zip",
  "application/x-zip-compressed": "zip",
  "application/vnd.rar": "rar",
  "application/x-rar-compressed": "rar",
  "application/x-7z-compressed": "7z",
  "application/x-tar": "tar",
  "application/gzip": "gz",
  "application/x-gzip": "gz",
  "application/x-bzip2": "bz2",
  "application/x-xz": "xz"
};
function archivePlugin() {
  return {
    name: "archive",
    match(file) {
      return archiveExtensions.has(file.extension) || archiveMimeTypes.has(file.mimeType);
    },
    async render(ctx) {
      const url = createObjectUrl(ctx.file);
      const isExternal = Boolean(ctx.file.url);
      const panel = createPanel("ofv-archive");
      ctx.viewport.append(panel);
      const ext = resolveFormat(ctx.file, archiveMimeFormatMap).toLowerCase();
      let archiveEntries = [];
      let isEncrypted = false;
      let parseError = null;
      let archiveProbe = null;
      try {
        if (ext === "zip") {
          try {
            const zip = await JSZip5.loadAsync(await readArrayBuffer(ctx.file), {
              decodeFileName: decodeZipFileName
            });
            archiveEntries = Object.values(zip.files).map((entry) => ({
              name: entry.name,
              unsafeName: entry.unsafeOriginalName,
              size: entry._data?.uncompressedSize || 0,
              dir: entry.dir,
              read: () => entry.async("arraybuffer")
            }));
          } catch (zipErr) {
            if (isEncryptedError(zipErr)) {
              isEncrypted = true;
            } else {
              throw zipErr;
            }
          }
        } else if (ext === "tar") {
          archiveEntries = untar(await readArrayBuffer(ctx.file));
        } else if (ext === "gz" || ext === "tgz" || ext === "tar.gz") {
          const u8 = new Uint8Array(await readArrayBuffer(ctx.file));
          const decompressed = pako.ungzip(u8);
          const originalName = ctx.file.name.endsWith(".gz") ? ctx.file.name.slice(0, -3) : ctx.file.name.endsWith(".tgz") ? ctx.file.name.slice(0, -4) + ".tar" : ctx.file.name;
          if (ext === "tgz" || ext === "tar.gz" || originalName.endsWith(".tar")) {
            archiveEntries = untar(toArrayBuffer(decompressed));
          } else {
            archiveEntries = [
              {
                name: originalName,
                size: decompressed.byteLength,
                dir: false,
                read: async () => toArrayBuffer(decompressed)
              }
            ];
          }
        } else if (ext === "bz2") {
          const compressed = new Uint8Array(await readArrayBuffer(ctx.file));
          const decompressed = await bunzip2(compressed);
          const originalName = ctx.file.name.toLowerCase().endsWith(".bz2") ? ctx.file.name.slice(0, -4) : ctx.file.name;
          archiveEntries = [
            {
              name: originalName || "decompressed",
              size: decompressed.byteLength,
              dir: false,
              read: async () => toArrayBuffer(decompressed)
            }
          ];
        } else if (ext === "xz") {
          const compressed = new Uint8Array(await readArrayBuffer(ctx.file));
          const decompressed = await unxz(compressed);
          const originalName = deriveSingleFileArchiveName(ctx.file.name, ".xz", "decompressed");
          if (originalName.toLowerCase().endsWith(".tar") || ctx.file.name.toLowerCase().endsWith(".txz")) {
            archiveEntries = untar(toArrayBuffer(decompressed));
          } else {
            archiveEntries = [
              {
                name: originalName,
                size: decompressed.byteLength,
                dir: false,
                read: async () => toArrayBuffer(decompressed)
              }
            ];
          }
        } else if (["rar", "7z"].includes(ext)) {
          archiveProbe = probeArchiveHeader(await readArrayBuffer(ctx.file), ext);
        } else {
          parseError = `\u8BE5\u683C\u5F0F (.${ext.toUpperCase()}) \u76EE\u524D\u6682\u4E0D\u652F\u6301\u76F4\u63A5\u5728\u6D4F\u89C8\u5668\u7AEF\u5728\u7EBF\u89E3\u538B\u548C\u76EE\u5F55\u9884\u89C8\u3002`;
        }
      } catch (err) {
        parseError = `\u538B\u7F29\u5305\u89E3\u6790\u5931\u8D25\uFF1A${err.message || err}`;
      }
      if (isEncrypted) {
        const fallback = createEncryptedFallback(ctx.file, url, {
          title: "\u538B\u7F29\u5305\u5DF2\u52A0\u5BC6\uFF0C\u65E0\u6CD5\u5728\u7EBF\u9884\u89C8",
          message: "\u8BF7\u4E0B\u8F7D\u540E\u5728\u672C\u5730\u8F93\u5165\u5BC6\u7801\u89E3\u538B\uFF0C\u6216\u4E0A\u4F20\u89E3\u5BC6\u540E\u7684\u538B\u7F29\u5305\u3002",
          action: "\u4E0B\u8F7D\u538B\u7F29\u5305"
        });
        panel.append(fallback);
        ctx.viewport.classList.add("ofv-center");
        return {
          destroy() {
            ctx.viewport.classList.remove("ofv-center");
            revokeObjectUrl(url, isExternal);
            panel.remove();
          }
        };
      }
      if (archiveProbe) {
        renderArchiveProbe(panel, archiveProbe, ctx.file.name, url);
        return {
          destroy() {
            revokeObjectUrl(url, isExternal);
            panel.remove();
          }
        };
      }
      if (parseError) {
        const fallback = document.createElement("div");
        fallback.className = "ofv-fallback";
        const title = document.createElement("strong");
        title.textContent = parseError;
        const meta = document.createElement("span");
        meta.textContent = "\u5EFA\u8BAE\u4E0B\u8F7D\u89C6\u9891/\u6587\u6863\u7B49\u6587\u4EF6\u81F3\u672C\u5730\u67E5\u770B\uFF0C\u6216\u4F7F\u7528\u539F\u751F\u89E3\u538B\u5DE5\u5177\u63D0\u53D6\u5185\u5BB9\u3002";
        const download = document.createElement("a");
        download.href = url;
        download.download = ctx.file.name;
        download.textContent = "\u4E0B\u8F7D\u538B\u7F29\u5305";
        fallback.append(title, meta, download);
        panel.append(fallback);
        ctx.viewport.classList.add("ofv-center");
        return {
          destroy() {
            ctx.viewport.classList.remove("ofv-center");
            revokeObjectUrl(url, isExternal);
            panel.remove();
          }
        };
      }
      const layout = document.createElement("div");
      layout.className = "ofv-archive-layout";
      const sidebar = document.createElement("div");
      sidebar.className = "ofv-archive-sidebar";
      const sidebarPanel = document.createElement("div");
      sidebarPanel.className = "ofv-archive-sidebar-panel";
      const header = document.createElement("div");
      header.className = "ofv-archive-header";
      const sidebarTitle = document.createElement("span");
      sidebarTitle.className = "ofv-archive-header-title";
      sidebarTitle.textContent = `\u6587\u4EF6\u5217\u8868 (${archiveEntries.filter((e) => !e.dir).length})`;
      const sidebarToggle = document.createElement("button");
      sidebarToggle.className = "ofv-archive-sidebar-toggle";
      sidebarToggle.type = "button";
      sidebarToggle.setAttribute("aria-label", "\u5C55\u5F00\u6587\u4EF6\u5217\u8868");
      sidebarToggle.setAttribute("aria-expanded", "false");
      sidebarToggle.title = "\u5C55\u5F00\u6587\u4EF6\u5217\u8868";
      sidebarToggle.textContent = "\u2039";
      header.append(sidebarToggle, sidebarTitle);
      sidebarPanel.append(header);
      const tree = document.createElement("div");
      tree.className = "ofv-archive-tree";
      sidebarPanel.append(tree);
      sidebar.append(sidebarPanel);
      const mainPanel = document.createElement("div");
      mainPanel.className = "ofv-archive-main";
      layout.append(sidebar, mainPanel);
      panel.append(layout);
      let currentSubInstance = null;
      const getSidebarViewportWidth = () => ctx.viewport.clientWidth || ctx.size.width;
      const shouldAutoCollapseSidebar = () => getSidebarViewportWidth() <= 520;
      const setSidebarCollapsed = (collapsed) => {
        layout.classList.toggle("is-sidebar-collapsed", collapsed);
        sidebarToggle.setAttribute("aria-expanded", String(!collapsed));
        const label = collapsed ? "\u5C55\u5F00\u6587\u4EF6\u5217\u8868" : "\u6536\u8D77\u6587\u4EF6\u5217\u8868";
        sidebarToggle.setAttribute("aria-label", label);
        sidebarToggle.title = label;
        sidebarToggle.textContent = collapsed ? "\u203A" : "\u2039";
      };
      setSidebarCollapsed(false);
      sidebarToggle.addEventListener("click", () => {
        setSidebarCollapsed(!layout.classList.contains("is-sidebar-collapsed"));
      });
      const showDefaultSummary = () => {
        mainPanel.replaceChildren();
        const summary = document.createElement("div");
        summary.className = "ofv-archive-info";
        hideSupplementalInfo4(summary);
        const heading = document.createElement("h3");
        heading.textContent = ctx.file.name;
        const info = document.createElement("div");
        info.className = "ofv-archive-info-meta";
        const fileCount = archiveEntries.filter((e) => !e.dir).length;
        const dirCount = archiveEntries.filter((e) => e.dir).length;
        appendArchiveInfo(info, "\u683C\u5F0F\u7C7B\u578B", `.${ext.toUpperCase()} \u538B\u7F29\u6587\u4EF6`);
        appendArchiveInfo(info, "\u5305\u542B\u6587\u4EF6\u6570", `${fileCount} \u4E2A`);
        appendArchiveInfo(info, "\u5305\u542B\u76EE\u5F55\u6570", `${dirCount} \u4E2A`);
        appendArchiveInfo(info, "\u64CD\u4F5C\u63D0\u793A", "\u8BF7\u70B9\u51FB\u5DE6\u4FA7\u680F\u4E2D\u7684\u6587\u4EF6\u8FDB\u884C\u8054\u52A8\u9884\u89C8\u3002");
        summary.append(heading, info, createArchiveSummary(archiveEntries));
        mainPanel.append(summary);
      };
      showDefaultSummary();
      const visibleEntries = archiveEntries.filter((e) => !e.dir).slice(0, 500);
      let destroyed = false;
      let renderToken = 0;
      const openArchiveEntry = async (entry, item) => {
        if (destroyed) {
          return;
        }
        if (shouldAutoCollapseSidebar()) {
          setSidebarCollapsed(true);
        }
        const token = ++renderToken;
        sidebar.querySelectorAll(".ofv-archive-item").forEach((el) => {
          el.classList.remove("is-active");
          el.removeAttribute("aria-current");
        });
        item.classList.add("is-active");
        item.setAttribute("aria-current", "true");
        if (currentSubInstance) {
          currentSubInstance.destroy();
          currentSubInstance = null;
          ctx.toolbar?.refreshCommandSupport();
        }
        mainPanel.replaceChildren(createArchiveLoading(entry.name.split("/").pop() || entry.name));
        try {
          let buffer = await entry.read();
          if (destroyed || token !== renderToken) {
            return;
          }
          const subName = entry.name.split("/").pop() || entry.name;
          const subExt = subName.split(".").pop()?.toLowerCase() || "";
          if (subExt === "shp") {
            const basePath = entry.name.slice(0, -4);
            const dbfEntry = archiveEntries.find((e) => e.name.toLowerCase() === basePath.toLowerCase() + ".dbf");
            const shxEntry = archiveEntries.find((e) => e.name.toLowerCase() === basePath.toLowerCase() + ".shx");
            if (dbfEntry && shxEntry) {
              const prjEntry = archiveEntries.find((e) => e.name.toLowerCase() === basePath.toLowerCase() + ".prj");
              const newZip = new JSZip5();
              newZip.file(subName, buffer);
              newZip.file(dbfEntry.name.split("/").pop(), await dbfEntry.read());
              newZip.file(shxEntry.name.split("/").pop(), await shxEntry.read());
              if (prjEntry) {
                newZip.file(prjEntry.name.split("/").pop(), await prjEntry.read());
              }
              buffer = await newZip.generateAsync({ type: "arraybuffer" });
              if (destroyed || token !== renderToken) {
                return;
              }
            }
          }
          const subContainer = document.createElement("div");
          subContainer.style.cssText = "width: 100%; height: 100%; position: relative; display: flex; flex-direction: column;";
          mainPanel.replaceChildren(subContainer);
          const subViewport = document.createElement("div");
          subViewport.className = "ofv-viewport";
          subViewport.style.cssText = "flex: 1; width: 100%; height: 100%; position: relative; overflow: auto;";
          subContainer.append(subViewport);
          const subFile = await normalizeFile(buffer, subName);
          const plugins = [...ctx.options.plugins || [], fallbackPlugin()];
          let matchedPlugin = await findSubPreviewPlugin(plugins, subFile);
          if (destroyed || token !== renderToken) {
            return;
          }
          if (matchedPlugin.name === "archive") {
            matchedPlugin = fallbackPlugin();
          }
          let previewError;
          const nextSubInstance = await Promise.resolve().then(
            () => matchedPlugin.render({
              host: ctx.host,
              viewport: subViewport,
              file: subFile,
              size: { width: subViewport.clientWidth || 600, height: subViewport.clientHeight || 400 },
              options: ctx.options,
              toolbar: ctx.toolbar,
              setLoading: () => {
              },
              setError: (err) => {
                previewError = err instanceof Error ? err : new Error(String(err));
                subViewport.replaceChildren(createInlineError("\u6587\u4EF6\u9884\u89C8\u5931\u8D25", previewError.message));
              }
            })
          ).catch((error) => {
            previewError = error instanceof Error ? error : new Error(String(error));
            subViewport.replaceChildren(createInlineError("\u6587\u4EF6\u9884\u89C8\u5931\u8D25", previewError.message));
            return void 0;
          });
          if (destroyed || token !== renderToken) {
            nextSubInstance?.destroy();
            return;
          }
          if (nextSubInstance && !previewError) {
            currentSubInstance = nextSubInstance;
            ctx.toolbar?.refreshCommandSupport();
          } else if (nextSubInstance) {
            nextSubInstance.destroy();
            ctx.toolbar?.refreshCommandSupport();
          }
        } catch (err) {
          if (destroyed || token !== renderToken) {
            return;
          }
          currentSubInstance = null;
          ctx.toolbar?.refreshCommandSupport();
          mainPanel.replaceChildren(createInlineError("\u89E3\u538B\u52A0\u8F7D\u5931\u8D25", String(err.message || err)));
        }
      };
      visibleEntries.forEach((entry, index) => {
        const item = document.createElement("button");
        item.className = "ofv-archive-item";
        item.type = "button";
        item.title = entry.name;
        const icon = document.createElement("span");
        icon.className = "ofv-archive-item-icon";
        icon.textContent = getIcon(entry.name, entry.dir);
        const name = document.createElement("span");
        name.className = "ofv-archive-item-name";
        name.textContent = entry.name;
        name.title = entry.name;
        item.append(icon, name);
        tree.append(item);
        item.addEventListener("click", async () => {
          await openArchiveEntry(entry, item);
        });
        if (index === 0) {
          void openArchiveEntry(entry, item);
        }
      });
      return {
        canCommand(command) {
          return currentSubInstance?.canCommand?.(command) ?? false;
        },
        command(command) {
          return currentSubInstance?.command?.(command) ?? false;
        },
        resize(size) {
          currentSubInstance?.resize?.(size);
        },
        destroy() {
          destroyed = true;
          renderToken += 1;
          if (currentSubInstance) {
            currentSubInstance.destroy();
          }
          revokeObjectUrl(url, isExternal);
          panel.remove();
        }
      };
    }
  };
}
async function findSubPreviewPlugin(plugins, file) {
  for (const plugin of plugins) {
    if (await plugin.match(file)) {
      return plugin;
    }
  }
  return fallbackPlugin();
}
async function bunzip2(bytes) {
  const restoreBuffer = installSeekBzipBufferCompat();
  try {
    const module = await import("seek-bzip");
    const decoder = module.default || module;
    const decoded = decoder.decode(bytes);
    return decoded instanceof Uint8Array ? decoded : decoded instanceof ArrayBuffer ? new Uint8Array(decoded) : Uint8Array.from(decoded);
  } finally {
    restoreBuffer();
  }
}
function installSeekBzipBufferCompat() {
  const globalObject = globalThis;
  if (typeof globalObject.Buffer === "function") {
    return () => void 0;
  }
  class SeekBzipBuffer extends Uint8Array {
    copy(target, targetStart = 0, sourceStart = 0, sourceEnd = this.length) {
      const slice = this.subarray(sourceStart, sourceEnd);
      target.set(slice, targetStart);
      return slice.length;
    }
    toString(encoding) {
      if (encoding === "hex") {
        return Array.from(this).map((byte) => byte.toString(16).padStart(2, "0")).join("");
      }
      return new TextDecoder().decode(this);
    }
  }
  globalObject.Buffer = SeekBzipBuffer;
  return () => {
    if (globalObject.Buffer === SeekBzipBuffer) {
      Reflect.deleteProperty(globalObject, "Buffer");
    }
  };
}
async function unxz(bytes) {
  const module = await import("xz-decompress");
  const XzReadableStream = module.XzReadableStream || module.default?.XzReadableStream;
  if (typeof XzReadableStream !== "function") {
    throw new Error("XZ \u89E3\u7801\u5668\u4E0D\u53EF\u7528\u3002");
  }
  const response = new Response(new XzReadableStream(createByteReadableStream(bytes)));
  return new Uint8Array(await response.arrayBuffer());
}
function createByteReadableStream(bytes) {
  const blob = new Blob([bytes]);
  if (typeof blob.stream === "function") {
    return blob.stream();
  }
  return new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    }
  });
}
function deriveSingleFileArchiveName(fileName, suffix, fallback) {
  return fileName.toLowerCase().endsWith(suffix) ? fileName.slice(0, -suffix.length) || fallback : fileName || fallback;
}
function toArrayBuffer(bytes) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}
function decodeZipFileName(bytes) {
  const data = Array.isArray(bytes) ? Uint8Array.from(bytes.map((value) => value.charCodeAt(0) & 255)) : bytes instanceof Uint8Array ? bytes : Uint8Array.from(bytes);
  const utf8 = decodeZipNameWith(data, "utf-8", true);
  if (utf8 && !looksMojibake(utf8)) {
    return utf8;
  }
  const gb18030 = decodeZipNameWith(data, "gb18030", false) || decodeZipNameWith(data, "gbk", false);
  if (gb18030 && !looksMojibake(gb18030)) {
    return gb18030;
  }
  return utf8 || new TextDecoder("latin1").decode(data);
}
function decodeZipNameWith(bytes, encoding, fatal) {
  try {
    return new TextDecoder(encoding, { fatal }).decode(bytes);
  } catch {
    return void 0;
  }
}
function looksMojibake(value) {
  return /[\uFFFDÃÂÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞß]/.test(value);
}
function createInlineError(titleText, detailText) {
  const fallback = document.createElement("div");
  fallback.className = "ofv-fallback";
  const title = document.createElement("strong");
  title.textContent = titleText;
  const detail = document.createElement("span");
  detail.textContent = detailText;
  fallback.append(title, detail);
  return fallback;
}
function appendArchiveInfo(parent, label, value) {
  const row = document.createElement("div");
  const key = document.createElement("strong");
  key.textContent = `${label}\uFF1A`;
  row.append(key, document.createTextNode(value));
  parent.append(row);
}
function hideSupplementalInfo4(element) {
  element.hidden = true;
  element.setAttribute("aria-hidden", "true");
  element.style.display = "none";
}
function createArchiveSummary(entries) {
  const files = entries.filter((entry) => !entry.dir);
  const summary = document.createElement("dl");
  summary.className = "ofv-archive-summary";
  const totalSize = files.reduce((sum, entry) => sum + entry.size, 0);
  const largest = files.reduce((current, entry) => !current || entry.size > current.size ? entry : current, void 0);
  appendArchiveSummary(summary, "\u603B\u89E3\u538B\u5927\u5C0F", formatBytes2(totalSize));
  appendArchiveSummary(summary, "\u6700\u5927\u6587\u4EF6", largest ? `${largest.name} \xB7 ${formatBytes2(largest.size)}` : "\u65E0");
  appendArchiveSummary(summary, "\u7C7B\u578B\u5206\u5E03", formatArchiveExtensions(files));
  appendArchiveSummary(summary, "\u53EF\u9884\u89C8\u6761\u76EE", String(files.slice(0, 500).length));
  appendArchiveSummary(summary, "\u98CE\u9669\u8DEF\u5F84", String(files.filter((entry) => isRiskyArchivePath(entry.unsafeName || entry.name)).length));
  return summary;
}
function appendArchiveSummary(parent, label, value) {
  const key = document.createElement("dt");
  key.textContent = label;
  const content = document.createElement("dd");
  content.textContent = value;
  parent.append(key, content);
}
function formatArchiveExtensions(entries) {
  const counts = /* @__PURE__ */ new Map();
  for (const entry of entries) {
    const name = entry.name.split("/").pop() || entry.name;
    const index = name.lastIndexOf(".");
    const extension = index > 0 ? name.slice(index + 1).toLowerCase() : "(\u65E0\u6269\u5C55\u540D)";
    counts.set(extension, (counts.get(extension) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 6).map(([extension, count]) => `${extension} ${count}`).join(", ") || "\u65E0";
}
function isRiskyArchivePath(name) {
  return name.startsWith("/") || /^[A-Za-z]:[\\/]/.test(name) || name.split(/[\\/]+/).includes("..");
}
function createArchiveLoading(fileName) {
  const loading = document.createElement("div");
  loading.className = "ofv-archive-loading";
  const spinner = document.createElement("div");
  spinner.className = "ofv-archive-loading-spinner";
  const text = document.createElement("span");
  text.textContent = `\u6B63\u5728\u89E3\u538B\u5E76\u52A0\u8F7D [${fileName}]...`;
  loading.append(spinner, text);
  return loading;
}
function renderArchiveProbe(panel, probe, fileName, url) {
  const section = createSection(`${probe.format} \u7ED3\u6784\u9884\u89C8`);
  const note = document.createElement("p");
  note.textContent = probe.note;
  const meta = document.createElement("div");
  meta.className = "ofv-archive-probe-meta";
  appendArchiveInfo(meta, "\u6587\u4EF6", fileName);
  appendArchiveInfo(meta, "\u683C\u5F0F", probe.format);
  for (const item of probe.meta) {
    appendArchiveInfo(meta, item.label, item.value);
  }
  const download = document.createElement("a");
  download.className = "ofv-asset-download";
  download.href = url;
  download.download = fileName;
  download.textContent = "\u4E0B\u8F7D\u538B\u7F29\u5305";
  section.append(note, meta, download);
  if (!probe.valid) {
    const error = document.createElement("p");
    error.className = "ofv-data-error";
    error.textContent = probe.error || "\u538B\u7F29\u5305\u5934\u4FE1\u606F\u65E0\u6CD5\u8BC6\u522B\u3002";
    section.append(error);
  }
  if (probe.entries.length > 0) {
    const wrapper = document.createElement("div");
    wrapper.className = "ofv-table-scroll ofv-archive-probe-table";
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const header = document.createElement("tr");
    for (const label of ["\u6587\u4EF6", "\u539F\u59CB\u5927\u5C0F", "\u538B\u7F29\u5927\u5C0F"]) {
      const th = document.createElement("th");
      th.textContent = label;
      header.append(th);
    }
    thead.append(header);
    const tbody = document.createElement("tbody");
    for (const entry of probe.entries.slice(0, 200)) {
      const tr = document.createElement("tr");
      for (const value of [
        entry.name,
        entry.size === void 0 ? "\u672A\u77E5" : formatBytes2(entry.size),
        entry.packedSize === void 0 ? "\u672A\u77E5" : formatBytes2(entry.packedSize)
      ]) {
        const td = document.createElement("td");
        td.textContent = value;
        tr.append(td);
      }
      tbody.append(tr);
    }
    table.append(thead, tbody);
    wrapper.append(table);
    section.append(wrapper);
  }
  panel.append(section);
}
function probeArchiveHeader(arrayBuffer, extension) {
  const bytes = new Uint8Array(arrayBuffer);
  if (extension === "rar") {
    return probeRar(bytes);
  }
  if (extension === "7z") {
    return probe7z(bytes);
  }
  if (extension === "bz2") {
    return probeBzip2(bytes);
  }
  if (extension === "xz") {
    return probeXz(bytes);
  }
  return {
    format: extension.toUpperCase(),
    valid: false,
    error: "\u6682\u4E0D\u652F\u6301\u8BE5\u538B\u7F29\u683C\u5F0F\u7684\u5934\u4FE1\u606F\u89E3\u6790\u3002",
    meta: [],
    entries: [],
    note: "\u5F53\u524D\u4EC5\u63D0\u4F9B\u538B\u7F29\u5305\u8BC6\u522B\u548C\u4E0B\u8F7D\u5165\u53E3\u3002"
  };
}
function probeRar(bytes) {
  const rar4 = bytes.length >= 7 && bytes[0] === 82 && bytes[1] === 97 && bytes[2] === 114 && bytes[3] === 33 && bytes[4] === 26 && bytes[5] === 7 && bytes[6] === 0;
  const rar5 = bytes.length >= 8 && bytes[0] === 82 && bytes[1] === 97 && bytes[2] === 114 && bytes[3] === 33 && bytes[4] === 26 && bytes[5] === 7 && bytes[6] === 1 && bytes[7] === 0;
  const entries = rar4 ? parseRar4Entries(bytes) : [];
  return {
    format: "RAR",
    valid: rar4 || rar5,
    error: rar4 || rar5 ? void 0 : "\u7F3A\u5C11 RAR signature\u3002",
    meta: [
      { label: "\u7248\u672C", value: rar5 ? "RAR5" : rar4 ? "RAR4" : "\u672A\u77E5" },
      { label: "\u7B7E\u540D", value: byteSignature(bytes) },
      { label: "\u53EF\u89C1\u6761\u76EE", value: String(entries.length) }
    ],
    entries,
    note: rar4 ? "\u5F53\u524D\u8F7B\u91CF\u8BFB\u53D6 RAR4 \u672A\u52A0\u5BC6\u6587\u4EF6\u5934\uFF0C\u7528\u4E8E\u76EE\u5F55\u786E\u8BA4\uFF1B\u5B9E\u9645\u89E3\u538B\u4ECD\u5EFA\u8BAE\u63A5\u5165 unrar WASM \u6216\u672C\u5730\u5DE5\u5177\u3002" : "\u5F53\u524D\u8BC6\u522B RAR \u5BB9\u5668\u548C\u7248\u672C\uFF1BRAR5 \u76EE\u5F55\u89E3\u6790\u9700\u8981\u4E13\u7528\u89E3\u7801\u5668\u3002"
  };
}
function parseRar4Entries(bytes) {
  const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const entries = [];
  let offset = 7;
  while (offset + 7 <= bytes.length && entries.length < 200) {
    const type = bytes[offset + 2];
    const flags = view3.getUint16(offset + 3, true);
    let headerSize = view3.getUint16(offset + 5, true);
    if (headerSize < 7 || offset + headerSize > bytes.length) {
      break;
    }
    if ((flags & 32768) !== 0) {
      if (offset + 11 > bytes.length) {
        break;
      }
      headerSize += view3.getUint32(offset + 7, true);
    }
    if (type === 116 && offset + 32 <= bytes.length) {
      const packedSize = view3.getUint32(offset + 7, true);
      const unpackedSize = view3.getUint32(offset + 11, true);
      const nameSize = view3.getUint16(offset + 26, true);
      const nameOffset = offset + 32;
      const nameEnd = Math.min(nameOffset + nameSize, offset + headerSize, bytes.length);
      const nameBytes = bytes.slice(nameOffset, nameEnd);
      const name = new TextDecoder("latin1").decode(nameBytes).replace(/\0.*$/, "");
      if (name) {
        entries.push({ name, size: unpackedSize, packedSize });
      }
    }
    offset += headerSize;
  }
  return entries;
}
function probe7z(bytes) {
  const valid = bytes.length >= 32 && bytes[0] === 55 && bytes[1] === 122 && bytes[2] === 188 && bytes[3] === 175 && bytes[4] === 39 && bytes[5] === 28;
  const meta = [{ label: "\u7B7E\u540D", value: byteSignature(bytes) }];
  if (valid) {
    const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    meta.push({ label: "\u7248\u672C", value: `${bytes[6]}.${bytes[7]}` });
    meta.push({ label: "Next header offset", value: String(readUint64Le2(view3, 12)) });
    meta.push({ label: "Next header size", value: String(readUint64Le2(view3, 20)) });
    meta.push({ label: "Next header CRC", value: `0x${view3.getUint32(28, true).toString(16).toUpperCase()}` });
  }
  return {
    format: "7Z",
    valid,
    error: valid ? void 0 : "\u7F3A\u5C11 7z signature\u3002",
    meta,
    entries: [],
    note: "\u5F53\u524D\u8BC6\u522B 7z \u5BB9\u5668\u548C next header \u8FB9\u754C\uFF1B\u76EE\u5F55\u548C\u89E3\u538B\u9700\u8981 LZMA/7z \u4E13\u7528\u89E3\u7801\u5668\u3002"
  };
}
function probeBzip2(bytes) {
  const valid = bytes.length >= 4 && bytes[0] === 66 && bytes[1] === 90 && bytes[2] === 104 && bytes[3] >= 49 && bytes[3] <= 57;
  return {
    format: "BZIP2",
    valid,
    error: valid ? void 0 : "\u7F3A\u5C11 BZh magic header\u3002",
    meta: [
      { label: "\u7B7E\u540D", value: byteSignature(bytes) },
      { label: "\u5757\u5927\u5C0F", value: valid ? `${String.fromCharCode(bytes[3])}00 KB` : "\u672A\u77E5" }
    ],
    entries: [],
    note: "BZIP2 \u901A\u5E38\u662F\u5355\u6587\u4EF6\u538B\u7F29\u6D41\uFF0C\u672C\u9884\u89C8\u5668\u5F53\u524D\u5C55\u793A\u5BB9\u5668\u5934\u4FE1\u606F\uFF1B\u89E3\u538B\u53EF\u540E\u7EED\u63A5\u5165 bzip2 \u89E3\u7801\u5668\u3002"
  };
}
function probeXz(bytes) {
  const valid = bytes.length >= 6 && bytes[0] === 253 && bytes[1] === 55 && bytes[2] === 122 && bytes[3] === 88 && bytes[4] === 90 && bytes[5] === 0;
  return {
    format: "XZ",
    valid,
    error: valid ? void 0 : "\u7F3A\u5C11 XZ magic header\u3002",
    meta: [
      { label: "\u7B7E\u540D", value: byteSignature(bytes) },
      { label: "Stream flags", value: bytes.length >= 8 ? `0x${bytes[6].toString(16).padStart(2, "0").toUpperCase()} 0x${bytes[7].toString(16).padStart(2, "0").toUpperCase()}` : "\u672A\u77E5" }
    ],
    entries: [],
    note: "XZ \u901A\u5E38\u662F\u5355\u6587\u4EF6 LZMA2 \u538B\u7F29\u6D41\uFF0C\u672C\u9884\u89C8\u5668\u5F53\u524D\u5C55\u793A\u5BB9\u5668\u5934\u4FE1\u606F\uFF1B\u89E3\u538B\u53EF\u540E\u7EED\u63A5\u5165 xz/lzma \u89E3\u7801\u5668\u3002"
  };
}
function readUint64Le2(view3, offset) {
  return BigInt(view3.getUint32(offset, true)) | BigInt(view3.getUint32(offset + 4, true)) << 32n;
}
function formatBytes2(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
function byteSignature(bytes) {
  if (bytes.length === 0) {
    return "\u7A7A\u6587\u4EF6";
  }
  const ascii = new TextDecoder("ascii").decode(bytes.slice(0, Math.min(bytes.length, 16))).replace(/[^\x20-\x7E]/g, ".");
  const hex = Array.from(bytes.slice(0, Math.min(bytes.length, 8))).map((byte) => byte.toString(16).padStart(2, "0").toUpperCase()).join(" ");
  return `${ascii} (${hex})`;
}
function untar(arrayBuffer) {
  const entries = [];
  const u8 = new Uint8Array(arrayBuffer);
  let offset = 0;
  const readString = (start, length) => {
    let end = start;
    while (end < start + length && u8[end] !== 0) {
      end++;
    }
    return new TextDecoder().decode(u8.subarray(start, end)).trim();
  };
  while (offset + 512 <= arrayBuffer.byteLength) {
    const magic = readString(offset + 257, 6);
    if (magic !== "ustar" && magic !== "ustar\0") {
      let allZero = true;
      for (let i = 0; i < 512; i++) {
        if (u8[offset + i] !== 0) {
          allZero = false;
          break;
        }
      }
      if (allZero) {
        break;
      }
      break;
    }
    const name = readString(offset, 100);
    const prefix = readString(offset + 345, 155);
    const fullName = prefix ? `${prefix}/${name}` : name;
    const sizeStr = readString(offset + 124, 12);
    const size = parseInt(sizeStr, 8) || 0;
    const typeflag = readString(offset + 156, 1);
    const dir = typeflag === "5" || fullName.endsWith("/");
    const contentOffset = offset + 512;
    entries.push({
      name: fullName,
      size,
      dir,
      read: async () => arrayBuffer.slice(contentOffset, contentOffset + size)
    });
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return entries;
}
function getIcon(name, dir) {
  if (dir) return "\u{1F4C1}";
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
    case "svg":
    case "webp":
      return "\u{1F5BC}\uFE0F";
    case "pdf":
      return "\u{1F4D5}";
    case "doc":
    case "docx":
      return "\u{1F4D8}";
    case "xls":
    case "xlsx":
      return "\u{1F4D7}";
    case "ppt":
    case "pptx":
      return "\u{1F4D9}";
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
      return "\u{1F4E6}";
    case "mp4":
    case "mkv":
    case "avi":
    case "webm":
      return "\u{1F3A5}";
    case "mp3":
    case "wav":
    case "ogg":
      return "\u{1F3B5}";
    case "txt":
    case "md":
    case "html":
    case "js":
    case "ts":
    case "json":
    case "css":
      return "\u{1F4C4}";
    default:
      return "\u{1F4C4}";
  }
}

// src/plugins/email.ts
import DOMPurify3 from "dompurify";
var emailExtensions = /* @__PURE__ */ new Set(["eml", "msg", "mbox"]);
var emailMimeTypes = /* @__PURE__ */ new Set(["message/rfc822", "application/vnd.ms-outlook", "application/mbox"]);
var emailMimeFormatMap = {
  "message/rfc822": "eml",
  "application/vnd.ms-outlook": "msg",
  "application/mbox": "mbox"
};
function emailPlugin() {
  return {
    name: "email",
    match(file) {
      return emailExtensions.has(file.extension) || emailMimeTypes.has(file.mimeType);
    },
    async render(ctx) {
      const panel = createPanel("ofv-email");
      ctx.viewport.append(panel);
      const url = createObjectUrl(ctx.file);
      const isExternal = Boolean(ctx.file.url);
      const ext = resolveFormat(ctx.file, emailMimeFormatMap).toLowerCase();
      let emailData;
      const objectUrlsToRevoke = [];
      const attachmentObjectUrls = /* @__PURE__ */ new Map();
      const timersToClear = [];
      const zoomController = createEmailZoomController(panel, ctx);
      let mboxSummary = [];
      try {
        if (ext === "msg") {
          const MsgReader = (await import("@kenjiuno/msgreader")).default;
          const buffer = await readArrayBuffer(ctx.file);
          const reader = new MsgReader(buffer);
          const parsed = reader.getFileData();
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          const from = parsed.senderName ? `${parsed.senderName} <${parsed.senderEmail || parsed.senderSmtpAddress || ""}>`.trim() : parsed.senderEmail || parsed.senderSmtpAddress || "";
          const recipients = parsed.recipients || [];
          const to = recipients.filter((r) => r.recipType === "to").map((r) => `${r.name || ""} <${r.email || r.smtpAddress || ""}>`.trim()).join("; ");
          const cc = recipients.filter((r) => r.recipType === "cc").map((r) => `${r.name || ""} <${r.email || r.smtpAddress || ""}>`.trim()).join("; ");
          const attachments = [];
          if (Array.isArray(parsed.attachments)) {
            parsed.attachments.forEach((att) => {
              try {
                const fullAtt = reader.getAttachment(att);
                attachments.push({
                  name: fullAtt.fileName || "\u672A\u547D\u540D\u9644\u4EF6",
                  mimeType: getAttachmentMimeType(fullAtt, att),
                  content: fullAtt.content,
                  contentId: att.pidContentId
                });
              } catch (attErr) {
                console.warn("Failed to parse attachment:", attErr);
              }
            });
          }
          let bodyHtml = parsed.bodyHtml;
          if (!bodyHtml && parsed.html instanceof Uint8Array) {
            bodyHtml = new TextDecoder("utf-8").decode(parsed.html);
          }
          emailData = {
            from: from || "-",
            to: to || "-",
            cc: cc || "",
            subject: parsed.subject || "(\u65E0\u4E3B\u9898)",
            date: parsed.messageDeliveryTime || parsed.clientSubmitTime || parsed.creationTime || "-",
            bodyText: parsed.body,
            bodyHtml,
            attachments
          };
        } else {
          const PostalMime = (await import("postal-mime")).default;
          const parser = new PostalMime();
          let rawSource = await readArrayBuffer(ctx.file);
          if (ext === "mbox") {
            let rawText = await readTextFile(ctx.file);
            const messages = splitMboxMessages(rawText);
            mboxSummary = messages.map(summarizeMboxMessage);
            rawSource = messages[0] || rawText;
          }
          const parsed = await parser.parse(rawSource);
          const from = parsed.from ? `${parsed.from.name || ""} <${parsed.from.address || ""}>`.trim() : "";
          const to = Array.isArray(parsed.to) ? parsed.to.map((t) => `${t.name || ""} <${t.address || ""}>`.trim()).join("; ") : "";
          const cc = Array.isArray(parsed.cc) ? parsed.cc.map((c) => `${c.name || ""} <${c.address || ""}>`.trim()).join("; ") : "";
          emailData = {
            from: from || "-",
            to: to || "-",
            cc: cc || "",
            subject: parsed.subject || "(\u65E0\u4E3B\u9898)",
            date: parsed.date || "-",
            bodyText: parsed.text,
            bodyHtml: parsed.html,
            attachments: (parsed.attachments || []).map((att) => ({
              name: att.filename || "\u672A\u547D\u540D\u9644\u4EF6",
              mimeType: att.mimeType || "application/octet-stream",
              content: att.content instanceof Uint8Array ? att.content : new Uint8Array(att.content),
              contentId: att.contentId
            }))
          };
        }
        if (mboxSummary.length > 0) {
          panel.append(createMboxSummarySection(mboxSummary));
        }
        const headerSection = createSection("\u90AE\u4EF6\u4FE1\u606F");
        hideSupplementalInfo5(headerSection);
        appendMeta(headerSection, "Subject", emailData.subject);
        appendMeta(headerSection, "From", emailData.from);
        appendMeta(headerSection, "To", emailData.to);
        if (emailData.cc) {
          appendMeta(headerSection, "Cc", emailData.cc);
        }
        appendMeta(headerSection, "Date", emailData.date);
        panel.append(headerSection);
        if (emailData.attachments.length > 0) {
          const attachmentsSection = createSection("\u9644\u4EF6\u5217\u8868");
          hideSupplementalInfo5(attachmentsSection);
          const container = document.createElement("div");
          container.className = "ofv-email-attachments";
          emailData.attachments.forEach((att) => {
            const blobUrl = getAttachmentObjectUrl(att, attachmentObjectUrls, objectUrlsToRevoke);
            const item = document.createElement("a");
            item.className = "ofv-email-attachment-item";
            item.href = blobUrl;
            item.download = att.name;
            item.rel = "noopener noreferrer";
            const sizeKB = Math.round(att.content.byteLength / 1024);
            item.textContent = `Attachment: ${att.name} (${sizeKB} KB)`;
            container.append(item);
          });
          attachmentsSection.append(container);
          panel.append(attachmentsSection);
        }
        const bodySection = createSection("\u6B63\u6587");
        panel.append(bodySection);
        let html = emailData.bodyHtml;
        if (html) {
          let nextHtml = html;
          emailData.attachments.forEach((att) => {
            const contentId = att.contentId;
            if (contentId) {
              const blobUrl = getAttachmentObjectUrl(att, attachmentObjectUrls, objectUrlsToRevoke);
              const cleanCid = contentId.replace(/[<>]/g, "");
              nextHtml = replaceCidResourceUrls(nextHtml, contentId, blobUrl);
              if (cleanCid !== contentId) {
                nextHtml = replaceCidResourceUrls(nextHtml, cleanCid, blobUrl);
              }
            }
          });
          html = nextHtml;
          const sanitizedHtml = sanitizeEmailHtml(html);
          const iframe = document.createElement("iframe");
          iframe.className = "ofv-email-body-iframe";
          iframe.setAttribute("sandbox", "allow-same-origin allow-popups allow-popups-to-escape-sandbox");
          iframe.style.cssText = "width: 100%; border: none; background: #fff; min-height: 200px;";
          let renderedHtmlBody = false;
          let resizeHtmlBody;
          const renderHtmlBody = () => {
            if (renderedHtmlBody) {
              return;
            }
            try {
              const idoc = iframe.contentDocument || iframe.contentWindow?.document;
              if (idoc) {
                renderedHtmlBody = true;
                idoc.open();
                idoc.write(`
                  <!doctype html>
                  <html>
                    <head>
                      <meta charset="utf-8" />
                      <style>
                        body {
                          margin: 16px;
                          padding: 0;
                          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                          font-size: 14px;
                          line-height: 1.6;
                          color: #1f2937;
                        }
                        img { max-width: 100%; height: auto; display: block; margin: 12px 0; }
                        a { color: #2563eb; }
                        blockquote {
                          margin: 12px 0;
                          padding-left: 12px;
                          border-left: 3px solid #d1d5db;
                          color: #4b5563;
                        }
                      </style>
                    </head>
                    <body>${sanitizedHtml}</body>
                  </html>
                `);
                idoc.close();
                secureEmailLinks(idoc);
                zoomController.setHtmlBody(idoc.body, () => resizeHtmlBody?.());
                ctx.toolbar?.refreshCommandSupport();
                const resize = () => {
                  const body = idoc.body;
                  const docEl = idoc.documentElement;
                  const height = Math.max(
                    body.scrollHeight,
                    body.offsetHeight,
                    docEl.clientHeight,
                    docEl.scrollHeight,
                    docEl.offsetHeight
                  );
                  iframe.style.height = `${height + 32}px`;
                };
                resizeHtmlBody = resize;
                resize();
                timersToClear.push(window.setTimeout(resize, 300));
                timersToClear.push(window.setTimeout(resize, 1e3));
              }
            } catch (err) {
              console.error("Failed to write html body to email iframe:", err);
            }
          };
          iframe.addEventListener("load", renderHtmlBody, { once: true });
          bodySection.append(iframe);
          renderHtmlBody();
        } else {
          const pre = document.createElement("pre");
          pre.className = "ofv-text-block";
          pre.textContent = emailData.bodyText || "\u672A\u89E3\u6790\u5230\u6B63\u6587\u3002";
          bodySection.append(pre);
        }
      } catch (err) {
        panel.replaceChildren();
        const errorSection = createSection("\u90AE\u4EF6\u89E3\u6790\u51FA\u9519");
        const pre = document.createElement("pre");
        pre.className = "ofv-text-block";
        pre.style.color = "#ef4444";
        pre.textContent = `\u89E3\u6790\u90AE\u4EF6\u65F6\u53D1\u751F\u9519\u8BEF\uFF1A
${err.message || err}`;
        errorSection.append(pre);
        panel.append(errorSection);
      }
      return {
        canCommand(command) {
          return zoomController.canCommand(command);
        },
        command(command) {
          return zoomController.command(command);
        },
        destroy() {
          timersToClear.forEach((timer) => window.clearTimeout(timer));
          objectUrlsToRevoke.forEach((u) => {
            URL.revokeObjectURL(u);
          });
          revokeObjectUrl(url, isExternal);
          panel.remove();
        }
      };
    }
  };
}
function createEmailZoomController(panel, ctx) {
  let zoom = 1;
  let htmlBody;
  let resizeHtmlBody;
  const apply = () => {
    const normalized = Math.round(zoom * 100) / 100;
    panel.style.setProperty("--ofv-email-zoom", String(normalized));
    if (htmlBody) {
      htmlBody.style.fontSize = `${Math.round(14 * normalized * 100) / 100}px`;
      resizeHtmlBody?.();
      window.setTimeout(() => resizeHtmlBody?.(), 0);
    }
    ctx.toolbar?.setZoom(normalized === 1 ? void 0 : normalized);
  };
  apply();
  return {
    setHtmlBody(body, resize) {
      htmlBody = body;
      resizeHtmlBody = resize;
      apply();
    },
    canCommand(command) {
      return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset";
    },
    command(command) {
      if (command === "zoom-in") {
        zoom = Math.min(3, zoom * 1.15);
        apply();
        return true;
      }
      if (command === "zoom-out") {
        zoom = Math.max(0.5, zoom / 1.15);
        apply();
        return true;
      }
      if (command === "zoom-reset") {
        zoom = 1;
        apply();
        return true;
      }
      return false;
    }
  };
}
function getAttachmentObjectUrl(attachment, cache, urlsToRevoke) {
  const cached = cache.get(attachment);
  if (cached) {
    return cached;
  }
  const blob = new Blob([attachment.content], { type: attachment.mimeType });
  const url = URL.createObjectURL(blob);
  cache.set(attachment, url);
  urlsToRevoke.push(url);
  return url;
}
function getAttachmentMimeType(fullAttachment, attachmentMeta) {
  const candidates = [fullAttachment, attachmentMeta];
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") {
      continue;
    }
    const record = candidate;
    const explicitMime = normalizeMimeValue(record.attachMimeTag) || normalizeMimeValue(record.mimeType) || normalizeMimeValue(record.contentType) || normalizeMimeValue(record.mime) || normalizeMimeValue(record["content-type"]);
    if (explicitMime) {
      return explicitMime;
    }
  }
  const fileName = (fullAttachment && typeof fullAttachment === "object" ? fullAttachment.fileName : void 0) || (attachmentMeta && typeof attachmentMeta === "object" ? attachmentMeta.fileName : void 0);
  return getMimeType(typeof fileName === "string" ? fileName : "");
}
function normalizeMimeValue(value) {
  if (typeof value !== "string") {
    return "";
  }
  const mimeType = value.split(";")[0]?.trim().toLowerCase() || "";
  return mimeType.includes("/") ? mimeType : "";
}
function replaceCidResourceUrls(html, contentId, blobUrl) {
  const escapedCid = escapeRegExp(contentId);
  return html.replace(
    new RegExp(`\\b(src|poster|background)=(["'])cid:${escapedCid}\\2`, "gi"),
    (_match, attribute, quote) => `${attribute}=${quote}${blobUrl}${quote}`
  );
}
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function createMboxSummarySection(messages) {
  const section = createSection("MBOX \u90AE\u7BB1\u6458\u8981");
  hideSupplementalInfo5(section);
  const meta = document.createElement("div");
  meta.className = "ofv-email-mbox-meta";
  appendMeta(meta, "\u90AE\u4EF6\u6570", String(messages.length));
  appendMeta(meta, "\u9884\u89C8", "\u5F53\u524D\u6B63\u6587\u663E\u793A\u7B2C\u4E00\u5C01\u90AE\u4EF6");
  const tableWrap = document.createElement("div");
  tableWrap.className = "ofv-table-scroll ofv-email-mbox-table";
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const header = document.createElement("tr");
  for (const label of ["#", "Subject", "From", "Date"]) {
    const th = document.createElement("th");
    th.textContent = label;
    header.append(th);
  }
  thead.append(header);
  const tbody = document.createElement("tbody");
  messages.slice(0, 100).forEach((message, index) => {
    const row = document.createElement("tr");
    for (const value of [String(index + 1), message.subject || "(\u65E0\u4E3B\u9898)", message.from || "-", message.date || "-"]) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    }
    tbody.append(row);
  });
  table.append(thead, tbody);
  tableWrap.append(table);
  section.append(meta, tableWrap);
  return section;
}
function hideSupplementalInfo5(element) {
  element.hidden = true;
  element.setAttribute("aria-hidden", "true");
  element.style.display = "none";
}
function splitMboxMessages(mboxText) {
  const lines = mboxText.replace(/\r\n/g, "\n").split("\n");
  const messages = [];
  let current = null;
  let foundFirstFrom = false;
  for (const line of lines) {
    if (line.startsWith("From ")) {
      if (current && current.length > 0) {
        messages.push(current);
      }
      current = [];
      foundFirstFrom = true;
      continue;
    }
    if (foundFirstFrom && current) {
      current.push(line.startsWith(">From ") ? line.slice(1) : line);
    }
  }
  if (current && current.length > 0) {
    messages.push(current);
  }
  return messages.length > 0 ? messages.map((message) => message.join("\n")) : [mboxText];
}
function summarizeMboxMessage(message) {
  return {
    from: unfoldHeader(readHeaderValue(message, "From")),
    subject: unfoldHeader(readHeaderValue(message, "Subject")),
    date: unfoldHeader(readHeaderValue(message, "Date"))
  };
}
function readHeaderValue(message, name) {
  const headers = message.split(/\n\s*\n/, 1)[0] || "";
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = headers.match(new RegExp(`^${escaped}:\\s*([\\s\\S]*?)(?=\\n[^\\s:]+:|\\n\\s*\\n|$)`, "im"));
  return match?.[1]?.trim() || "";
}
function unfoldHeader(value) {
  return value.replace(/\n[ \t]+/g, " ").trim();
}
function getMimeType(name) {
  const ext = name.split(".").pop()?.toLowerCase();
  const map = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
    md: "text/markdown",
    html: "text/html",
    mp4: "video/mp4",
    mp3: "audio/mpeg",
    wav: "audio/wav"
  };
  return ext ? map[ext] || "application/octet-stream" : "application/octet-stream";
}
function sanitizeEmailHtml(html) {
  return DOMPurify3.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_ATTR: ["target"],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|blob|cid):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i
  });
}
function secureEmailLinks(document2) {
  for (const link of document2.querySelectorAll("a[href]")) {
    const href = link.getAttribute("href") || "";
    if (!isSafeEmailHref(href)) {
      link.removeAttribute("href");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      continue;
    }
    if (/^(https?:)?\/\//i.test(href)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  }
}
function isSafeEmailHref(href) {
  const trimmed = href.trim();
  return trimmed.startsWith("#") || trimmed.startsWith("/") || trimmed.startsWith("./") || trimmed.startsWith("../") || trimmed.startsWith("blob:") || /^(https?:|mailto:|tel:)/i.test(trimmed);
}

// src/plugins/drawing.ts
import pako2 from "pako";
var drawingExtensions = /* @__PURE__ */ new Set(["drawio", "dio", "excalidraw", "tldraw"]);
var drawingMimeFormatMap = {
  "application/vnd.jgraph.mxfile": "drawio",
  "application/vnd.excalidraw+json": "excalidraw",
  "application/x-excalidraw+json": "excalidraw"
};
var SVG_NS = "http://www.w3.org/2000/svg";
function drawingPlugin() {
  return {
    name: "drawing",
    match(file) {
      return drawingExtensions.has(file.extension) || Boolean(drawingMimeFormatMap[file.mimeType]);
    },
    async render(ctx) {
      const panel = createPanel("ofv-drawing");
      ctx.viewport.append(panel);
      const text = await readTextFile(ctx.file);
      const extension = resolveFormat(ctx.file, drawingMimeFormatMap);
      let controller;
      try {
        if (extension === "excalidraw") {
          renderExcalidraw(panel, text);
        } else if (extension === "tldraw") {
          renderTldraw(panel, text);
        } else if (extension === "drawio" || extension === "dio") {
          renderDrawio(panel, text);
        } else {
          renderRawDrawing(panel, extension || "drawing", text);
        }
        controller = createSvgViewportController(panel, ctx);
      } catch (error) {
        renderDrawingParseFallback(panel, extension || "drawing", text, error);
      }
      return {
        canCommand(command) {
          return controller?.canCommand(command) ?? false;
        },
        command(command) {
          return controller?.command(command) ?? false;
        },
        destroy() {
          controller?.destroy();
          panel.remove();
        }
      };
    }
  };
}
function createSvgViewportController(panel, ctx) {
  const svg = panel.querySelector(".ofv-svg-stage");
  const initialViewBox = parseSvgViewBox2(svg);
  if (!svg || !initialViewBox) {
    return void 0;
  }
  let currentViewBox = { ...initialViewBox };
  let rotation = 0;
  const applyViewBox = () => {
    svg.setAttribute(
      "viewBox",
      `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.width} ${currentViewBox.height}`
    );
    ctx.toolbar?.setZoom(initialViewBox.width / currentViewBox.width);
  };
  const applyRotation = () => {
    svg.style.transformOrigin = "center center";
    svg.style.transform = rotation === 0 ? "" : `rotate(${rotation}deg)`;
  };
  applyViewBox();
  return {
    canCommand(command) {
      return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset" || command === "rotate-right" || command === "rotate-left";
    },
    command(command) {
      if (command === "zoom-in" || command === "zoom-out") {
        const factor = command === "zoom-in" ? 0.82 : 1.18;
        const centerX = currentViewBox.x + currentViewBox.width / 2;
        const centerY = currentViewBox.y + currentViewBox.height / 2;
        currentViewBox.width *= factor;
        currentViewBox.height *= factor;
        currentViewBox.x = centerX - currentViewBox.width / 2;
        currentViewBox.y = centerY - currentViewBox.height / 2;
        applyViewBox();
        return true;
      }
      if (command === "zoom-reset") {
        currentViewBox = { ...initialViewBox };
        rotation = 0;
        applyViewBox();
        applyRotation();
        return true;
      }
      if (command === "rotate-right" || command === "rotate-left") {
        rotation += command === "rotate-right" ? 90 : -90;
        applyRotation();
        return true;
      }
      return false;
    },
    destroy() {
      ctx.toolbar?.setZoom(void 0);
    }
  };
}
function parseSvgViewBox2(svg) {
  const parts = svg?.getAttribute("viewBox")?.trim().split(/[\s,]+/).map(Number);
  if (!parts || parts.length !== 4 || parts.some((part) => !Number.isFinite(part)) || parts[2] <= 0 || parts[3] <= 0) {
    return void 0;
  }
  return {
    x: parts[0],
    y: parts[1],
    width: parts[2],
    height: parts[3]
  };
}
function createDrawingSummary(items) {
  const summary = document.createElement("div");
  summary.className = "ofv-drawing-summary";
  summary.hidden = items.length > 0;
  if (items.length > 0) {
    summary.setAttribute("aria-hidden", "true");
    summary.style.display = "none";
  }
  const typeCounts = countDrawingTypes(items);
  appendDrawingSummary(summary, "\u5BF9\u8C61", String(items.length));
  appendDrawingSummary(summary, "\u7C7B\u578B", formatDrawingTypes(typeCounts));
  appendDrawingSummary(summary, "\u6587\u672C", String(items.filter((item) => item.text && item.text.trim()).length));
  appendDrawingSummary(summary, "\u8FDE\u7EBF", String(items.filter((item) => item.edge).length));
  const media = items.filter((item) => item.image || item.embed).length;
  if (media > 0) {
    appendDrawingSummary(summary, "\u5A92\u4F53/\u5D4C\u5165", String(media));
  }
  const bounds = drawingBounds(items);
  if (bounds) {
    appendDrawingSummary(summary, "\u8303\u56F4", `${Math.round(bounds[0])}, ${Math.round(bounds[1])}, ${Math.round(bounds[2])}, ${Math.round(bounds[3])}`);
  }
  return summary;
}
function appendDrawingSummary(parent, label, value) {
  const item = document.createElement("span");
  const key = document.createElement("span");
  key.textContent = label;
  const content = document.createElement("strong");
  content.textContent = value;
  item.append(key, content);
  parent.append(item);
}
function hideSuccessfulSectionHeading2(section) {
  const heading = section.querySelector("h3");
  if (heading) {
    hideSupplementalInfo6(heading);
  }
}
function hideSupplementalInfo6(element) {
  element.hidden = true;
  element.setAttribute("aria-hidden", "true");
  element.style.display = "none";
}
function countDrawingTypes(items) {
  const counts = /* @__PURE__ */ new Map();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) || 0) + 1);
  }
  return counts;
}
function formatDrawingTypes(counts) {
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([type, count]) => `${type} ${count}`).join(", ") || "\u65E0";
}
function drawingBounds(items) {
  const boxes = items.map((item) => {
    if (!Number.isFinite(item.x) || !Number.isFinite(item.y)) {
      return void 0;
    }
    const x = item.x;
    const y = item.y;
    const width = Math.max(0, finiteNumber3(item.width, 0));
    const height = Math.max(0, finiteNumber3(item.height, 0));
    return [x, y, x + width, y + height];
  }).filter((item) => Boolean(item));
  if (boxes.length === 0) {
    return void 0;
  }
  return [
    Math.min(...boxes.map((box) => box[0])),
    Math.min(...boxes.map((box) => box[1])),
    Math.max(...boxes.map((box) => box[2])),
    Math.max(...boxes.map((box) => box[3]))
  ];
}
function excalidrawSummaryItem(element) {
  return {
    type: String(element.type || "unknown"),
    x: finiteNumber3(element.x, 0),
    y: finiteNumber3(element.y, 0),
    width: finiteNumber3(element.width, 0),
    height: finiteNumber3(element.height, 0),
    text: String(element.text || element.name || ""),
    image: element.type === "image",
    embed: element.type === "embeddable",
    edge: element.type === "arrow" || element.type === "line"
  };
}
function tldrawSummaryItem(shape) {
  const props = shape.props || {};
  return {
    type: String(shape.type || props.type || "unknown"),
    x: finiteNumber3(shape.x, 0),
    y: finiteNumber3(shape.y, 0),
    width: finiteNumber3(props.w, finiteNumber3(props.width, 0)),
    height: finiteNumber3(props.h, finiteNumber3(props.height, 0)),
    text: String(props.text || ""),
    edge: shape.type === "arrow" || shape.type === "line"
  };
}
function drawioSummaryItem(shape) {
  return {
    type: shape.edge ? "edge" : drawioShapeName(shape.style),
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height,
    text: shape.value,
    image: drawioShapeName(shape.style) === "image",
    edge: shape.edge
  };
}
function renderExcalidraw(panel, text) {
  const data = JSON.parse(text);
  const files = data.files || {};
  const elements = (data.elements || []).filter((element) => !element.isDeleted);
  const section = createSection(`Excalidraw ${elements.length} elements`);
  if (elements.length > 0) {
    hideSuccessfulSectionHeading2(section);
  }
  section.append(createDrawingSummary(elements.map(excalidrawSummaryItem)));
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "ofv-svg-stage");
  svg.setAttribute("viewBox", createExcalidrawViewBox(elements));
  const defs = document.createElementNS(SVG_NS, "defs");
  svg.append(defs);
  for (const element of elements) {
    const type = String(element.type || "");
    const x = Number(element.x || 0);
    const y = Number(element.y || 0);
    const width = Number(element.width || 80);
    const height = Number(element.height || 40);
    const stroke = String(element.strokeColor || "#111827");
    const fill = excalidrawFill(svg, defs, element, stroke);
    const common = getExcalidrawCommonAttrs(element);
    const transform = excalidrawTransform(element, x, y, width, height);
    if (type === "frame") {
      const frame = document.createElementNS(SVG_NS, "rect");
      applySvgAttrs(frame, {
        x,
        y,
        width,
        height,
        rx: 4,
        fill: "transparent",
        stroke: "#94a3b8",
        "stroke-width": 2,
        "stroke-dasharray": "8 6",
        opacity: common.opacity,
        transform
      });
      svg.append(frame);
      appendSvgMultilineText(svg, String(element.name || "Frame"), x + 12, y + 24, "#64748b", {
        fontSize: 14,
        transform
      });
    } else if (type === "image") {
      renderExcalidrawImage(svg, element, files, x, y, width, height, common, transform);
    } else if (type === "embeddable") {
      renderExcalidrawEmbeddable(svg, element, x, y, width, height, common, transform);
    } else if (type === "rectangle" || type === "diamond") {
      if (type === "diamond") {
        const polygon = document.createElementNS(SVG_NS, "polygon");
        polygon.setAttribute(
          "points",
          `${x + width / 2},${y} ${x + width},${y + height / 2} ${x + width / 2},${y + height} ${x},${y + height / 2}`
        );
        applySvgAttrs(polygon, { fill, stroke, ...common, transform });
        svg.append(polygon);
      } else {
        const rect = document.createElementNS(SVG_NS, "rect");
        applySvgAttrs(rect, {
          x,
          y,
          width,
          height,
          rx: finiteNumber3(element.roundness && typeof element.roundness === "object" ? element.roundness.value : void 0, 0),
          fill,
          stroke,
          ...common,
          transform
        });
        svg.append(rect);
      }
    } else if (type === "ellipse") {
      const ellipse = document.createElementNS(SVG_NS, "ellipse");
      applySvgAttrs(ellipse, {
        cx: x + width / 2,
        cy: y + height / 2,
        rx: Math.abs(width / 2),
        ry: Math.abs(height / 2),
        fill,
        stroke,
        ...common,
        transform
      });
      svg.append(ellipse);
    } else if (type === "line" || type === "arrow") {
      const points = excalidrawPoints(element, x, y, width, height);
      if (points.length > 2) {
        const polyline = document.createElementNS(SVG_NS, "polyline");
        applySvgAttrs(polyline, {
          points: points.map((point) => `${point.x},${point.y}`).join(" "),
          fill: "none",
          stroke,
          ...common,
          transform
        });
        svg.append(polyline);
        appendExcalidrawArrowHeads(svg, element, points, stroke);
      } else {
        const start = points[0] || { x, y };
        const end = points[points.length - 1] || { x: x + width, y: y + height };
        const line = document.createElementNS(SVG_NS, "line");
        applySvgAttrs(line, {
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
          stroke,
          ...common,
          transform
        });
        svg.append(line);
        appendExcalidrawArrowHeads(svg, element, [start, end], stroke);
      }
    } else if (type === "freedraw") {
      const path = createExcalidrawFreedrawPath(element, x, y);
      if (path) {
        applySvgAttrs(path, { fill: "none", stroke, ...common, transform });
        svg.append(path);
      }
    } else if (type === "text") {
      const fontSize = finiteNumber3(element.fontSize, 18);
      const lines = String(element.text || "").split(/\r?\n/);
      const textAlign = String(element.textAlign || "left");
      const verticalAlign = String(element.verticalAlign || "top");
      const anchor = textAlign === "center" ? "middle" : textAlign === "right" ? "end" : "start";
      const textX = textAlign === "center" ? x + width / 2 : textAlign === "right" ? x + width : x;
      const textY = verticalAlign === "middle" ? y + height / 2 - (lines.length - 1) * fontSize * 1.25 / 2 : verticalAlign === "bottom" ? y + height - (lines.length - 1) * fontSize * 1.25 : y + fontSize;
      appendSvgMultilineText(svg, String(element.text || ""), textX, textY, stroke, {
        fontSize,
        fontFamily: String(element.fontFamily || "Inter, ui-sans-serif, system-ui, sans-serif"),
        anchor,
        dominantBaseline: verticalAlign === "middle" ? "middle" : "auto",
        opacity: common.opacity,
        transform
      });
    }
  }
  section.append(svg);
  panel.append(section);
}
function renderExcalidrawImage(svg, element, files, x, y, width, height, common, transform) {
  const fileId = String(element.fileId || "");
  const file = fileId ? files[fileId] : void 0;
  const dataUrl = file?.dataURL || "";
  if (isSafeExcalidrawImageDataUrl(dataUrl)) {
    const image = document.createElementNS(SVG_NS, "image");
    applySvgAttrs(image, {
      x,
      y,
      width,
      height,
      href: dataUrl,
      preserveAspectRatio: "xMidYMid meet",
      opacity: common.opacity,
      transform
    });
    svg.append(image);
    return;
  }
  const rect = document.createElementNS(SVG_NS, "rect");
  applySvgAttrs(rect, {
    x,
    y,
    width,
    height,
    rx: 8,
    fill: "#f8fafc",
    stroke: "#94a3b8",
    "stroke-width": 1.5,
    "stroke-dasharray": "6 4",
    opacity: common.opacity,
    transform
  });
  svg.append(rect);
  appendSvgMultilineText(svg, fileId ? `Image
${fileId}` : "Image", x + width / 2, y + height / 2 - 8, "#64748b", {
    fontSize: 13,
    anchor: "middle",
    transform
  });
}
function renderExcalidrawEmbeddable(svg, element, x, y, width, height, common, transform) {
  const rect = document.createElementNS(SVG_NS, "rect");
  applySvgAttrs(rect, {
    x,
    y,
    width,
    height,
    rx: 10,
    fill: "#eef2ff",
    stroke: "#6366f1",
    "stroke-width": 1.5,
    "stroke-dasharray": "8 5",
    opacity: common.opacity,
    transform
  });
  svg.append(rect);
  const link = String(element.link || element.url || "Embedded content");
  appendSvgMultilineText(svg, `Embed
${shortenText(link, 48)}`, x + width / 2, y + height / 2 - 10, "#4338ca", {
    fontSize: 13,
    anchor: "middle",
    transform
  });
}
function appendSvgMultilineText(svg, text, x, y, fill, options = {}) {
  const textNode = document.createElementNS(SVG_NS, "text");
  applySvgAttrs(textNode, {
    x,
    y,
    fill,
    "font-size": options.fontSize || 18,
    "font-family": options.fontFamily || "Inter, ui-sans-serif, system-ui, sans-serif",
    "text-anchor": options.anchor,
    "dominant-baseline": options.dominantBaseline,
    opacity: options.opacity,
    transform: options.transform
  });
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    const span = document.createElementNS(SVG_NS, "tspan");
    span.setAttribute("x", String(x));
    span.setAttribute("dy", index === 0 ? "0" : "1.25em");
    span.textContent = line;
    textNode.append(span);
  }
  svg.append(textNode);
  return textNode;
}
function isSafeExcalidrawImageDataUrl(value) {
  return /^data:image\/(?:png|jpe?g|gif|webp|bmp);base64,/i.test(value);
}
function shortenText(value, maxLength) {
  return value.length > maxLength ? `${value.slice(0, Math.max(0, maxLength - 3))}...` : value;
}
function createExcalidrawViewBox(elements) {
  if (elements.length === 0) {
    return "0 0 1200 800";
  }
  const bounds = elements.map((element) => {
    const x = finiteNumber3(element.x, 0);
    const y = finiteNumber3(element.y, 0);
    const points = Array.isArray(element.points) ? element.points.map((point) => pointFromValue(point, { x: 0, y: 0 })) : [];
    const width = Math.max(1, finiteNumber3(element.width, Math.max(80, ...points.map((point) => point.x))));
    const height = Math.max(1, finiteNumber3(element.height, Math.max(40, ...points.map((point) => point.y))));
    return { x, y, width, height };
  });
  const minX = Math.min(...bounds.map((bound) => bound.x)) - 40;
  const minY = Math.min(...bounds.map((bound) => bound.y)) - 40;
  const maxX = Math.max(...bounds.map((bound) => bound.x + bound.width)) + 40;
  const maxY = Math.max(...bounds.map((bound) => bound.y + bound.height)) + 40;
  return `${minX} ${minY} ${Math.max(320, maxX - minX)} ${Math.max(240, maxY - minY)}`;
}
function getExcalidrawCommonAttrs(element) {
  const strokeWidth = finiteNumber3(element.strokeWidth, 1.5);
  const opacity = Math.max(0, Math.min(1, finiteNumber3(element.opacity, 100) / 100));
  const style = String(element.strokeStyle || "solid");
  return {
    "stroke-width": strokeWidth,
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-dasharray": style === "dashed" ? `${strokeWidth * 6} ${strokeWidth * 4}` : style === "dotted" ? `${strokeWidth} ${strokeWidth * 4}` : "",
    opacity
  };
}
function excalidrawFill(svg, defs, element, stroke) {
  const value = String(element.backgroundColor || "transparent");
  if (!value || value === "transparent") {
    return "transparent";
  }
  const fillStyle = String(element.fillStyle || "solid");
  if (fillStyle === "solid") {
    return value;
  }
  const id = `ofv-excalidraw-${fillStyle}-${defs.children.length}`;
  const pattern = document.createElementNS(SVG_NS, "pattern");
  applySvgAttrs(pattern, {
    id,
    width: 10,
    height: 10,
    patternUnits: "userSpaceOnUse"
  });
  const background = document.createElementNS(SVG_NS, "rect");
  applySvgAttrs(background, { width: 10, height: 10, fill: value, opacity: 0.35 });
  pattern.append(background);
  if (fillStyle === "cross-hatch") {
    pattern.append(createPatternLine(svg, "M 0 10 L 10 0", stroke));
    pattern.append(createPatternLine(svg, "M 0 0 L 10 10", stroke));
  } else if (fillStyle === "dots") {
    const dot = document.createElementNS(SVG_NS, "circle");
    applySvgAttrs(dot, { cx: 5, cy: 5, r: 1.2, fill: stroke, opacity: 0.48 });
    pattern.append(dot);
  } else {
    pattern.append(createPatternLine(svg, "M 0 10 L 10 0", stroke));
  }
  defs.append(pattern);
  return `url(#${id})`;
}
function createPatternLine(svg, d, stroke) {
  const path = document.createElementNS(SVG_NS, "path");
  applySvgAttrs(path, {
    d,
    stroke,
    "stroke-width": 1,
    "stroke-linecap": "round",
    opacity: 0.42
  });
  return path;
}
function excalidrawTransform(element, x, y, width, height) {
  const angle = finiteNumber3(element.angle, 0);
  if (!angle) {
    return "";
  }
  return `rotate(${angle * 180 / Math.PI} ${x + width / 2} ${y + height / 2})`;
}
function excalidrawPoints(element, x, y, width, height) {
  if (!Array.isArray(element.points)) {
    return [
      { x, y },
      { x: x + width, y: y + height }
    ];
  }
  return element.points.map((point) => {
    const parsed = pointFromValue(point, { x: 0, y: 0 });
    return { x: x + parsed.x, y: y + parsed.y };
  });
}
function createExcalidrawFreedrawPath(element, x, y) {
  const points = excalidrawPoints(element, x, y, 0, 0);
  if (points.length < 2) {
    return null;
  }
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute(
    "d",
    points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ")
  );
  return path;
}
function appendExcalidrawArrowHeads(svg, element, points, stroke) {
  if (String(element.type || "") !== "arrow" || points.length < 2) {
    return;
  }
  const startHead = String(element.startArrowhead || "");
  const endHead = String(element.endArrowhead || "arrow");
  if (startHead && startHead !== "none") {
    appendArrowHead(svg, points[1].x, points[1].y, points[0].x, points[0].y, stroke, startHead);
  }
  if (endHead && endHead !== "none") {
    const previous = points[points.length - 2];
    const end = points[points.length - 1];
    appendArrowHead(svg, previous.x, previous.y, end.x, end.y, stroke, endHead);
  }
}
function applySvgAttrs(element, attributes) {
  for (const [key, value] of Object.entries(attributes)) {
    if (value === void 0 || value === "") {
      continue;
    }
    element.setAttribute(key, String(value));
  }
}
function renderTldraw(panel, text) {
  const data = JSON.parse(text);
  const shapes = extractTldrawShapes(data);
  const section = createSection(`tldraw \u57FA\u7840\u9884\u89C8 ${shapes.length} shapes`);
  if (shapes.length > 0) {
    hideSuccessfulSectionHeading2(section);
  }
  section.append(createDrawingSummary(shapes.map(tldrawSummaryItem)));
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "ofv-svg-stage");
  svg.setAttribute("viewBox", createTldrawViewBox(shapes));
  if (shapes.length === 0) {
    const empty = document.createElementNS(svg.namespaceURI, "text");
    empty.setAttribute("x", "24");
    empty.setAttribute("y", "40");
    empty.setAttribute("fill", "#64748b");
    empty.textContent = "\u672A\u89E3\u6790\u5230\u53EF\u5C55\u793A\u7684 tldraw \u56FE\u5F62\u3002";
    svg.append(empty);
  } else {
    for (const shape of shapes) {
      renderTldrawShape(svg, shape);
    }
  }
  section.append(svg);
  panel.append(section);
}
function extractTldrawShapes(data) {
  if (!data || typeof data !== "object") {
    return [];
  }
  const source = data;
  const candidates = [];
  if (Array.isArray(source.records)) {
    candidates.push(...source.records);
  }
  if (Array.isArray(source.shapes)) {
    candidates.push(...source.shapes);
  }
  if (source.store && typeof source.store === "object") {
    candidates.push(...Object.values(source.store));
  }
  if (source.document && typeof source.document === "object") {
    const documentRecord = source.document;
    if (Array.isArray(documentRecord.shapes)) {
      candidates.push(...documentRecord.shapes);
    }
  }
  return candidates.filter((item) => {
    if (!item || typeof item !== "object") {
      return false;
    }
    const record = item;
    return record.typeName === "shape" || String(record.id || "").startsWith("shape:");
  });
}
function renderTldrawShape(svg, shape) {
  const props = shape.props || {};
  const type = String(shape.type || props.type || "");
  const x = finiteNumber3(shape.x, 0);
  const y = finiteNumber3(shape.y, 0);
  const width = Math.max(1, finiteNumber3(props.w, finiteNumber3(props.width, 120)));
  const height = Math.max(1, finiteNumber3(props.h, finiteNumber3(props.height, 80)));
  const stroke = tldrawColor(String(props.color || shape.color || "black"));
  const fill = tldrawFill(String(props.fill || "none"), stroke);
  if (type === "geo" || type === "frame" || type === "highlight") {
    const geo = String(props.geo || (type === "frame" ? "rectangle" : "rectangle"));
    if (geo === "ellipse" || geo === "oval") {
      const ellipse = document.createElementNS(svg.namespaceURI, "ellipse");
      ellipse.setAttribute("cx", String(x + width / 2));
      ellipse.setAttribute("cy", String(y + height / 2));
      ellipse.setAttribute("rx", String(width / 2));
      ellipse.setAttribute("ry", String(height / 2));
      ellipse.setAttribute("fill", fill);
      ellipse.setAttribute("stroke", stroke);
      ellipse.setAttribute("stroke-width", "2");
      svg.append(ellipse);
    } else if (geo === "diamond") {
      const polygon = document.createElementNS(svg.namespaceURI, "polygon");
      polygon.setAttribute(
        "points",
        `${x + width / 2},${y} ${x + width},${y + height / 2} ${x + width / 2},${y + height} ${x},${y + height / 2}`
      );
      polygon.setAttribute("fill", fill);
      polygon.setAttribute("stroke", stroke);
      polygon.setAttribute("stroke-width", "2");
      svg.append(polygon);
    } else if (geo === "triangle") {
      const polygon = document.createElementNS(svg.namespaceURI, "polygon");
      polygon.setAttribute("points", `${x + width / 2},${y} ${x + width},${y + height} ${x},${y + height}`);
      polygon.setAttribute("fill", fill);
      polygon.setAttribute("stroke", stroke);
      polygon.setAttribute("stroke-width", "2");
      svg.append(polygon);
    } else {
      const rect = document.createElementNS(svg.namespaceURI, "rect");
      rect.setAttribute("x", String(x));
      rect.setAttribute("y", String(y));
      rect.setAttribute("width", String(width));
      rect.setAttribute("height", String(height));
      rect.setAttribute("rx", type === "frame" ? "0" : "8");
      rect.setAttribute("fill", fill);
      rect.setAttribute("stroke", stroke);
      rect.setAttribute("stroke-width", "2");
      svg.append(rect);
    }
    appendTldrawText(svg, String(props.text || ""), x + 12, y + 24, stroke);
  } else if (type === "text" || type === "note") {
    if (type === "note") {
      const note = document.createElementNS(svg.namespaceURI, "rect");
      note.setAttribute("x", String(x));
      note.setAttribute("y", String(y));
      note.setAttribute("width", String(width));
      note.setAttribute("height", String(height));
      note.setAttribute("rx", "6");
      note.setAttribute("fill", tldrawColor(String(props.color || "yellow"), 0.24));
      note.setAttribute("stroke", stroke);
      svg.append(note);
    }
    appendTldrawText(svg, String(props.text || ""), x, y + 18, stroke);
  } else if (type === "arrow" || type === "line") {
    renderTldrawLine(svg, shape, stroke);
  } else if (type === "draw") {
    renderTldrawDraw(svg, shape, stroke);
  } else {
    const rect = document.createElementNS(svg.namespaceURI, "rect");
    rect.setAttribute("x", String(x));
    rect.setAttribute("y", String(y));
    rect.setAttribute("width", String(width));
    rect.setAttribute("height", String(height));
    rect.setAttribute("fill", "transparent");
    rect.setAttribute("stroke", stroke);
    rect.setAttribute("stroke-dasharray", "6 4");
    svg.append(rect);
    appendTldrawText(svg, type || "shape", x + 8, y + 20, stroke);
  }
}
function renderTldrawLine(svg, shape, stroke) {
  const props = shape.props || {};
  const x = finiteNumber3(shape.x, 0);
  const y = finiteNumber3(shape.y, 0);
  const start = pointFromValue(props.start, { x: 0, y: 0 });
  const end = pointFromValue(props.end, {
    x: finiteNumber3(props.w, finiteNumber3(props.width, 120)),
    y: finiteNumber3(props.h, finiteNumber3(props.height, 0))
  });
  const line = document.createElementNS(svg.namespaceURI, "line");
  line.setAttribute("x1", String(x + start.x));
  line.setAttribute("y1", String(y + start.y));
  line.setAttribute("x2", String(x + end.x));
  line.setAttribute("y2", String(y + end.y));
  line.setAttribute("stroke", stroke);
  line.setAttribute("stroke-width", "3");
  line.setAttribute("stroke-linecap", "round");
  svg.append(line);
  if (String(shape.type || "") === "arrow") {
    appendArrowHead(svg, x + start.x, y + start.y, x + end.x, y + end.y, stroke);
  }
}
function renderTldrawDraw(svg, shape, stroke) {
  const props = shape.props || {};
  const x = finiteNumber3(shape.x, 0);
  const y = finiteNumber3(shape.y, 0);
  const points = extractTldrawDrawPoints(props.segments);
  if (points.length < 2) {
    return;
  }
  const polyline = document.createElementNS(svg.namespaceURI, "polyline");
  polyline.setAttribute("points", points.map((point) => `${x + point.x},${y + point.y}`).join(" "));
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", stroke);
  polyline.setAttribute("stroke-width", "3");
  polyline.setAttribute("stroke-linecap", "round");
  polyline.setAttribute("stroke-linejoin", "round");
  svg.append(polyline);
}
function appendTldrawText(svg, text, x, y, fill) {
  if (!text.trim()) {
    return;
  }
  const textNode = document.createElementNS(svg.namespaceURI, "text");
  textNode.setAttribute("x", String(x));
  textNode.setAttribute("y", String(y));
  textNode.setAttribute("fill", fill);
  textNode.setAttribute("font-size", "16");
  textNode.setAttribute("font-family", "Inter, ui-sans-serif, system-ui, sans-serif");
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    const span = document.createElementNS(svg.namespaceURI, "tspan");
    span.setAttribute("x", String(x));
    span.setAttribute("dy", index === 0 ? "0" : "1.3em");
    span.textContent = line;
    textNode.append(span);
  }
  svg.append(textNode);
}
function appendArrowHead(svg, x1, y1, x2, y2, fill, type = "arrow") {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const size = 10;
  if (type === "bar") {
    const line = document.createElementNS(SVG_NS, "line");
    const dx = Math.sin(angle) * size * 0.65;
    const dy = Math.cos(angle) * size * 0.65;
    applySvgAttrs(line, {
      x1: x2 - dx,
      y1: y2 + dy,
      x2: x2 + dx,
      y2: y2 - dy,
      stroke: fill,
      "stroke-width": 2,
      "stroke-linecap": "round"
    });
    svg.append(line);
    return;
  }
  if (type === "dot" || type === "circle") {
    const circle = document.createElementNS(SVG_NS, "circle");
    applySvgAttrs(circle, { cx: x2, cy: y2, r: size * 0.42, fill });
    svg.append(circle);
    return;
  }
  const points = [
    [x2, y2],
    [x2 - size * Math.cos(angle - Math.PI / 6), y2 - size * Math.sin(angle - Math.PI / 6)],
    [x2 - size * Math.cos(angle + Math.PI / 6), y2 - size * Math.sin(angle + Math.PI / 6)]
  ];
  const polygon = document.createElementNS(svg.namespaceURI, "polygon");
  polygon.setAttribute("points", points.map((point) => point.join(",")).join(" "));
  polygon.setAttribute("fill", type === "triangle_outline" || type === "arrow_outline" ? "transparent" : fill);
  polygon.setAttribute("stroke", fill);
  svg.append(polygon);
}
function createTldrawViewBox(shapes) {
  if (shapes.length === 0) {
    return "0 0 800 500";
  }
  const bounds = shapes.map((shape) => {
    const props = shape.props || {};
    const x = finiteNumber3(shape.x, 0);
    const y = finiteNumber3(shape.y, 0);
    const width = Math.max(1, finiteNumber3(props.w, finiteNumber3(props.width, 120)));
    const height = Math.max(1, finiteNumber3(props.h, finiteNumber3(props.height, 80)));
    return { x, y, width, height };
  });
  const minX = Math.min(...bounds.map((bound) => bound.x)) - 40;
  const minY = Math.min(...bounds.map((bound) => bound.y)) - 40;
  const maxX = Math.max(...bounds.map((bound) => bound.x + bound.width)) + 40;
  const maxY = Math.max(...bounds.map((bound) => bound.y + bound.height)) + 40;
  return `${minX} ${minY} ${Math.max(240, maxX - minX)} ${Math.max(180, maxY - minY)}`;
}
function extractTldrawDrawPoints(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((segment) => {
    if (!segment || typeof segment !== "object") {
      return [];
    }
    const points = segment.points;
    if (!Array.isArray(points)) {
      return [];
    }
    return points.map((point) => pointFromValue(point, { x: 0, y: 0 }));
  });
}
function pointFromValue(value, fallback) {
  if (Array.isArray(value)) {
    return {
      x: finiteNumber3(value[0], fallback.x),
      y: finiteNumber3(value[1], fallback.y)
    };
  }
  if (!value || typeof value !== "object") {
    return fallback;
  }
  const point = value;
  return {
    x: finiteNumber3(point.x, fallback.x),
    y: finiteNumber3(point.y, fallback.y)
  };
}
function finiteNumber3(value, fallback) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}
function tldrawFill(fill, stroke) {
  return fill === "solid" || fill === "semi" || fill === "pattern" ? tldrawColor(stroke, 0.14) : "transparent";
}
function tldrawColor(value, alpha = 1) {
  const colors = {
    black: [17, 24, 39],
    grey: [100, 116, 139],
    light: [203, 213, 225],
    red: [220, 38, 38],
    orange: [234, 88, 12],
    yellow: [202, 138, 4],
    green: [22, 163, 74],
    blue: [37, 99, 235],
    violet: [124, 58, 237],
    purple: [147, 51, 234],
    pink: [219, 39, 119]
  };
  if (value.startsWith("#") || value.startsWith("rgb")) {
    return value;
  }
  const color = colors[value] || colors.black;
  return alpha >= 1 ? `rgb(${color.join(" ")})` : `rgb(${color.join(" ")} / ${alpha})`;
}
function renderDrawio(panel, text) {
  const diagrams = extractDrawioDiagrams(text);
  if (diagrams.length === 0) {
    renderRawDrawing(panel, "Draw.io", text);
    return;
  }
  for (const [index, diagram] of diagrams.entries()) {
    const section = createSection(`Draw.io \u56FE\u5F62\u9884\u89C8 ${index + 1}`);
    const shapes = parseDrawioShapes(diagram);
    if (shapes.length > 0) {
      hideSuccessfulSectionHeading2(section);
      section.append(createDrawingSummary(shapes.map(drawioSummaryItem)));
      const svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("class", "ofv-svg-stage");
      svg.setAttribute("viewBox", createDrawioViewBox(shapes));
      for (const shape of shapes) {
        renderDrawioShape(svg, shape);
      }
      section.append(svg);
    }
    const details = document.createElement("details");
    details.className = "ofv-details";
    const summary = document.createElement("summary");
    summary.textContent = shapes.length > 0 ? `\u539F\u59CB XML \u6458\u8981\uFF08${shapes.length} cells\uFF09` : "Draw.io \u539F\u59CB\u5185\u5BB9";
    const pre = document.createElement("pre");
    pre.className = "ofv-text-block";
    pre.textContent = diagram.slice(0, 3e4);
    details.append(summary, pre);
    if (shapes.length > 0) {
      details.hidden = true;
      details.setAttribute("aria-hidden", "true");
      details.style.display = "none";
    }
    section.append(details);
    panel.append(section);
  }
}
function extractDrawioDiagrams(text) {
  const matches = [...text.matchAll(/<diagram[^>]*>([\s\S]*?)<\/diagram>/g)].map((match) => decodeDrawioDiagram(match[1] || ""));
  if (matches.length > 0) {
    return matches;
  }
  return text.includes("<mxGraphModel") ? [text] : [];
}
function parseDrawioShapes(xml) {
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) {
    return [];
  }
  return Array.from(doc.querySelectorAll("mxCell")).flatMap((cell) => {
    const geometry = Array.from(cell.children).find((child) => child.localName === "mxGeometry");
    const vertex = cell.getAttribute("vertex") === "1";
    const edge = cell.getAttribute("edge") === "1";
    if (!vertex && !edge) {
      return [];
    }
    const shape = {
      id: cell.getAttribute("id") || "",
      value: decodeXmlText(cell.getAttribute("value") || ""),
      style: parseDrawioStyle(cell.getAttribute("style") || ""),
      vertex,
      edge,
      x: finiteNumber3(geometry?.getAttribute("x"), 0),
      y: finiteNumber3(geometry?.getAttribute("y"), 0),
      width: Math.max(1, finiteNumber3(geometry?.getAttribute("width"), 120)),
      height: Math.max(1, finiteNumber3(geometry?.getAttribute("height"), edge ? 1 : 60)),
      source: cell.getAttribute("source") || void 0,
      target: cell.getAttribute("target") || void 0
    };
    if (edge && geometry) {
      const points = Array.from(geometry.children).filter((child) => child.localName === "mxPoint").map((point) => ({
        x: finiteNumber3(point.getAttribute("x"), 0),
        y: finiteNumber3(point.getAttribute("y"), 0)
      }));
      if (points.length >= 2) {
        shape.x = points[0].x;
        shape.y = points[0].y;
        shape.width = points[points.length - 1].x - points[0].x;
        shape.height = points[points.length - 1].y - points[0].y;
        shape.points = points;
      }
    }
    return [shape];
  });
}
function parseDrawioStyle(style) {
  const result = {};
  const imageMatch = style.match(/(?:^|;)image=(data:image\/[^;]+;base64,[^;]+)/i);
  const protectedStyle = imageMatch ? style.replace(imageMatch[0], imageMatch[0].startsWith(";") ? ";image=__OFV_IMAGE__" : "image=__OFV_IMAGE__") : style;
  for (const part of protectedStyle.split(";")) {
    if (!part) {
      continue;
    }
    const separator = part.indexOf("=");
    const key = separator >= 0 ? part.slice(0, separator) : part;
    const value = separator >= 0 ? part.slice(separator + 1) : "1";
    if (key) {
      result[key] = value === "__OFV_IMAGE__" && imageMatch ? imageMatch[1] : value;
    }
  }
  return result;
}
function createDrawioViewBox(shapes) {
  const bounds = shapes.map((shape) => ({
    x: Math.min(shape.x, shape.x + shape.width),
    y: Math.min(shape.y, shape.y + shape.height),
    width: Math.abs(shape.width),
    height: Math.abs(shape.height)
  }));
  const minX = Math.min(...bounds.map((bound) => bound.x)) - 40;
  const minY = Math.min(...bounds.map((bound) => bound.y)) - 40;
  const maxX = Math.max(...bounds.map((bound) => bound.x + bound.width)) + 40;
  const maxY = Math.max(...bounds.map((bound) => bound.y + bound.height)) + 40;
  return `${minX} ${minY} ${Math.max(320, maxX - minX)} ${Math.max(240, maxY - minY)}`;
}
function renderDrawioShape(svg, shape) {
  const stroke = drawioColor(shape.style.strokeColor, "#334155");
  const fill = shape.style.fillColor === "none" ? "transparent" : drawioColor(shape.style.fillColor, "#f8fafc");
  const strokeWidth = finiteNumber3(shape.style.strokeWidth, 1.5);
  const opacity = Math.max(0, Math.min(1, finiteNumber3(shape.style.opacity, 100) / 100));
  const strokeAttrs = drawioStrokeAttrs(shape.style, strokeWidth);
  const transform = drawioTransform(shape);
  if (shape.edge) {
    const points = shape.points || [
      { x: shape.x, y: shape.y },
      { x: shape.x + shape.width, y: shape.y + shape.height }
    ];
    if (points.length > 2) {
      const polyline = document.createElementNS(SVG_NS, "polyline");
      applySvgAttrs(polyline, {
        points: points.map((point) => `${point.x},${point.y}`).join(" "),
        fill: "none",
        stroke,
        ...strokeAttrs,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        opacity
      });
      svg.append(polyline);
    } else {
      const line = document.createElementNS(SVG_NS, "line");
      applySvgAttrs(line, {
        x1: points[0].x,
        y1: points[0].y,
        x2: points[1].x,
        y2: points[1].y,
        stroke,
        ...strokeAttrs,
        "stroke-linecap": "round",
        opacity
      });
      svg.append(line);
    }
    if (shape.style.endArrow && shape.style.endArrow !== "none") {
      const tail = points[Math.max(0, points.length - 2)];
      const head = points[points.length - 1];
      appendArrowHead(svg, tail.x, tail.y, head.x, head.y, stroke);
    }
    return;
  }
  const shapeName = drawioShapeName(shape.style);
  if (shapeName === "image") {
    renderDrawioImage(svg, shape, opacity, transform);
  } else if (shapeName === "ellipse") {
    const ellipse = document.createElementNS(SVG_NS, "ellipse");
    applySvgAttrs(ellipse, {
      cx: shape.x + shape.width / 2,
      cy: shape.y + shape.height / 2,
      rx: shape.width / 2,
      ry: shape.height / 2,
      fill,
      stroke,
      ...strokeAttrs,
      opacity,
      transform
    });
    svg.append(ellipse);
  } else if (shapeName === "rhombus" || shapeName === "diamond") {
    const polygon = document.createElementNS(SVG_NS, "polygon");
    applySvgAttrs(polygon, {
      points: `${shape.x + shape.width / 2},${shape.y} ${shape.x + shape.width},${shape.y + shape.height / 2} ${shape.x + shape.width / 2},${shape.y + shape.height} ${shape.x},${shape.y + shape.height / 2}`,
      fill,
      stroke,
      ...strokeAttrs,
      opacity,
      transform
    });
    svg.append(polygon);
  } else if (shapeName === "hexagon" || shapeName === "process") {
    const polygon = document.createElementNS(SVG_NS, "polygon");
    const inset = shapeName === "process" ? shape.width * 0.12 : shape.width * 0.22;
    applySvgAttrs(polygon, {
      points: shapeName === "process" ? `${shape.x},${shape.y} ${shape.x + shape.width - inset},${shape.y} ${shape.x + shape.width},${shape.y + shape.height / 2} ${shape.x + shape.width - inset},${shape.y + shape.height} ${shape.x},${shape.y + shape.height}` : `${shape.x + inset},${shape.y} ${shape.x + shape.width - inset},${shape.y} ${shape.x + shape.width},${shape.y + shape.height / 2} ${shape.x + shape.width - inset},${shape.y + shape.height} ${shape.x + inset},${shape.y + shape.height} ${shape.x},${shape.y + shape.height / 2}`,
      fill,
      stroke,
      ...strokeAttrs,
      opacity,
      transform
    });
    svg.append(polygon);
  } else if (shapeName === "triangle") {
    const polygon = document.createElementNS(SVG_NS, "polygon");
    applySvgAttrs(polygon, {
      points: `${shape.x + shape.width / 2},${shape.y} ${shape.x + shape.width},${shape.y + shape.height} ${shape.x},${shape.y + shape.height}`,
      fill,
      stroke,
      ...strokeAttrs,
      opacity,
      transform
    });
    svg.append(polygon);
  } else if (shapeName === "actor" || shapeName === "umlActor") {
    renderDrawioActor(svg, shape, stroke, strokeAttrs, opacity, transform);
  } else if (shapeName === "document") {
    const path = document.createElementNS(SVG_NS, "path");
    applySvgAttrs(path, {
      d: createDrawioDocumentPath(shape.x, shape.y, shape.width, shape.height),
      fill,
      stroke,
      ...strokeAttrs,
      opacity,
      transform
    });
    svg.append(path);
  } else if (shapeName === "cylinder") {
    const group = document.createElementNS(SVG_NS, "g");
    applySvgAttrs(group, { transform });
    const body = document.createElementNS(SVG_NS, "rect");
    applySvgAttrs(body, {
      x: shape.x,
      y: shape.y + Math.min(18, shape.height * 0.18) / 2,
      width: shape.width,
      height: shape.height - Math.min(18, shape.height * 0.18),
      fill,
      stroke,
      ...strokeAttrs,
      opacity
    });
    const top = document.createElementNS(SVG_NS, "ellipse");
    const bottom = document.createElementNS(SVG_NS, "ellipse");
    const capHeight = Math.min(18, shape.height * 0.18);
    applySvgAttrs(top, {
      cx: shape.x + shape.width / 2,
      cy: shape.y + capHeight / 2,
      rx: shape.width / 2,
      ry: capHeight / 2,
      fill,
      stroke,
      ...strokeAttrs,
      opacity
    });
    applySvgAttrs(bottom, {
      cx: shape.x + shape.width / 2,
      cy: shape.y + shape.height - capHeight / 2,
      rx: shape.width / 2,
      ry: capHeight / 2,
      fill: "none",
      stroke,
      ...strokeAttrs,
      opacity
    });
    group.append(body, top, bottom);
    svg.append(group);
  } else if (shapeName === "cloud") {
    const path = document.createElementNS(SVG_NS, "path");
    applySvgAttrs(path, {
      d: createDrawioCloudPath(shape.x, shape.y, shape.width, shape.height),
      fill,
      stroke,
      ...strokeAttrs,
      opacity,
      transform
    });
    svg.append(path);
  } else if (shapeName === "swimlane") {
    const rect = document.createElementNS(SVG_NS, "rect");
    applySvgAttrs(rect, {
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
      rx: shape.style.rounded === "1" ? Math.min(12, shape.height / 5) : 0,
      fill,
      stroke,
      ...strokeAttrs,
      opacity,
      transform
    });
    const header = document.createElementNS(SVG_NS, "rect");
    const headerHeight = Math.min(shape.height, finiteNumber3(shape.style.startSize, 30));
    applySvgAttrs(header, {
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: headerHeight,
      rx: shape.style.rounded === "1" ? Math.min(12, headerHeight / 3) : 0,
      fill: drawioColor(shape.style.swimlaneFillColor || shape.style.fillColor, "#e2e8f0"),
      stroke,
      ...strokeAttrs,
      opacity,
      transform
    });
    svg.append(rect, header);
  } else {
    const rect = document.createElementNS(SVG_NS, "rect");
    applySvgAttrs(rect, {
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
      rx: shape.style.rounded === "1" ? Math.min(12, shape.height / 5) : 0,
      fill,
      stroke,
      ...strokeAttrs,
      opacity,
      transform
    });
    svg.append(rect);
  }
  appendDrawioText(
    svg,
    shape.value,
    shape.x + shape.width / 2,
    shape.y + shape.height / 2,
    drawioColor(shape.style.fontColor, "#111827"),
    shape.style,
    transform
  );
}
function drawioShapeName(style) {
  if (style.shape) {
    return style.shape;
  }
  if (style.image) {
    return "image";
  }
  if (style.ellipse === "1") {
    return "ellipse";
  }
  if (style.rhombus === "1") {
    return "rhombus";
  }
  if (style.swimlane === "1") {
    return "swimlane";
  }
  if (style.text === "1") {
    return "text";
  }
  return "rectangle";
}
function renderDrawioImage(svg, shape, opacity, transform) {
  const src = shape.style.image || "";
  if (/^data:image\/(?:png|jpe?g|gif|webp|svg\+xml);base64,/i.test(src)) {
    const image = document.createElementNS(SVG_NS, "image");
    applySvgAttrs(image, {
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height,
      href: src,
      preserveAspectRatio: "xMidYMid meet",
      opacity,
      transform
    });
    svg.append(image);
    return;
  }
  const rect = document.createElementNS(SVG_NS, "rect");
  applySvgAttrs(rect, {
    x: shape.x,
    y: shape.y,
    width: shape.width,
    height: shape.height,
    rx: 6,
    fill: "#f8fafc",
    stroke: "#94a3b8",
    "stroke-dasharray": "6 4",
    opacity,
    transform
  });
  svg.append(rect);
}
function renderDrawioActor(svg, shape, stroke, strokeAttrs, opacity, transform) {
  const group = document.createElementNS(SVG_NS, "g");
  applySvgAttrs(group, { opacity, transform });
  const cx = shape.x + shape.width / 2;
  const headRadius = Math.min(shape.width, shape.height) * 0.15;
  const head = document.createElementNS(SVG_NS, "circle");
  applySvgAttrs(head, {
    cx,
    cy: shape.y + headRadius * 1.4,
    r: headRadius,
    fill: "transparent",
    stroke,
    ...strokeAttrs
  });
  const body = createSvgLine(cx, shape.y + headRadius * 2.4, cx, shape.y + shape.height * 0.68, stroke, strokeAttrs);
  const arms = createSvgLine(shape.x + shape.width * 0.22, shape.y + shape.height * 0.42, shape.x + shape.width * 0.78, shape.y + shape.height * 0.42, stroke, strokeAttrs);
  const leftLeg = createSvgLine(cx, shape.y + shape.height * 0.68, shape.x + shape.width * 0.25, shape.y + shape.height, stroke, strokeAttrs);
  const rightLeg = createSvgLine(cx, shape.y + shape.height * 0.68, shape.x + shape.width * 0.75, shape.y + shape.height, stroke, strokeAttrs);
  group.append(head, body, arms, leftLeg, rightLeg);
  svg.append(group);
}
function createSvgLine(x1, y1, x2, y2, stroke, strokeAttrs) {
  const line = document.createElementNS(SVG_NS, "line");
  applySvgAttrs(line, {
    x1,
    y1,
    x2,
    y2,
    stroke,
    ...strokeAttrs,
    "stroke-linecap": "round"
  });
  return line;
}
function createDrawioDocumentPath(x, y, width, height) {
  const wave = Math.min(18, height * 0.18);
  return [
    `M ${x} ${y}`,
    `H ${x + width}`,
    `V ${y + height - wave}`,
    `C ${x + width * 0.72} ${y + height - wave * 2}, ${x + width * 0.58} ${y + height + wave * 0.5}, ${x + width * 0.34} ${y + height - wave * 0.4}`,
    `C ${x + width * 0.18} ${y + height - wave}, ${x + width * 0.08} ${y + height - wave * 0.2}, ${x} ${y + height - wave * 0.45}`,
    "Z"
  ].join(" ");
}
function drawioStrokeAttrs(style, strokeWidth) {
  const attrs = {
    "stroke-width": strokeWidth
  };
  if (style.dashed === "1") {
    attrs["stroke-dasharray"] = style.dashPattern || `${strokeWidth * 4} ${strokeWidth * 3}`;
  }
  return attrs;
}
function drawioTransform(shape) {
  const rotation = finiteNumber3(shape.style.rotation, 0);
  if (!rotation) {
    return "";
  }
  return `rotate(${rotation} ${shape.x + shape.width / 2} ${shape.y + shape.height / 2})`;
}
function createDrawioCloudPath(x, y, width, height) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  return [
    `M ${x + width * 0.24} ${y + height * 0.72}`,
    `C ${x - width * 0.02} ${y + height * 0.68}, ${x + width * 0.02} ${y + height * 0.34}, ${x + width * 0.28} ${y + height * 0.38}`,
    `C ${x + width * 0.32} ${y + height * 0.12}, ${cx} ${y + height * 0.06}, ${x + width * 0.62} ${y + height * 0.26}`,
    `C ${x + width * 0.86} ${y + height * 0.2}, ${x + width * 1.02} ${y + height * 0.42}, ${x + width * 0.88} ${y + height * 0.62}`,
    `C ${x + width * 0.86} ${y + height * 0.84}, ${x + width * 0.42} ${y + height * 0.9}, ${x + width * 0.24} ${y + height * 0.72}`,
    "Z"
  ].join(" ");
}
function appendDrawioText(svg, text, x, y, fill, style = {}, transform = "") {
  if (!text.trim()) {
    return;
  }
  const lines = normalizeDrawioLabel(text).split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) {
    return;
  }
  const textNode = document.createElementNS(SVG_NS, "text");
  const align = style.align || "center";
  const fontStyle = Number.parseInt(style.fontStyle || "0", 10);
  applySvgAttrs(textNode, {
    x: align === "left" ? x - finiteNumber3(style.spacingLeft, 0) : align === "right" ? x + finiteNumber3(style.spacingRight, 0) : x,
    y,
    fill,
    "font-size": finiteNumber3(style.fontSize, 14),
    "font-family": "Inter, ui-sans-serif, system-ui, sans-serif",
    "font-weight": fontStyle & 1 ? "700" : void 0,
    "font-style": fontStyle & 2 ? "italic" : void 0,
    "text-decoration": fontStyle & 4 ? "underline" : void 0,
    "text-anchor": align === "left" ? "start" : align === "right" ? "end" : "middle",
    "dominant-baseline": "middle",
    transform
  });
  const firstDy = lines.length > 1 ? `${-0.55 * (lines.length - 1)}em` : "0";
  for (const [index, line] of lines.entries()) {
    const span = document.createElementNS(SVG_NS, "tspan");
    span.setAttribute("x", String(x));
    span.setAttribute("dy", index === 0 ? firstDy : "1.2em");
    span.textContent = line;
    textNode.append(span);
  }
  svg.append(textNode);
}
function normalizeDrawioLabel(text) {
  const decoded = decodeXmlText(text);
  return decoded.replace(/<br\s*\/?>/gi, "\n").replace(/<\/(?:div|p|li|h\d)>/gi, "\n").replace(/<[^>]+>/g, "").split(/\r?\n/).map((line) => decodeXmlText(line).replace(/\u00a0/g, " ").replace(/[ \t]+/g, " ").trim()).filter(Boolean).join("\n");
}
function drawioColor(value, fallback) {
  if (!value || value === "default") {
    return fallback;
  }
  return value.startsWith("#") ? value : `#${value}`;
}
function decodeXmlText(value) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = value;
  return textarea.value;
}
function renderRawDrawing(panel, extension, text) {
  const section = createSection(`${extension} \u57FA\u7840\u9884\u89C8`);
  const pre = document.createElement("pre");
  pre.className = "ofv-text-block";
  pre.textContent = text.slice(0, 3e4);
  section.append(pre);
  panel.append(section);
}
function renderDrawingParseFallback(panel, extension, text, error) {
  panel.replaceChildren();
  const section = createSection(`${extension} \u89E3\u6790\u5931\u8D25`);
  const message = document.createElement("p");
  message.textContent = error instanceof Error ? error.message : String(error);
  const pre = document.createElement("pre");
  pre.className = "ofv-text-block";
  pre.textContent = text.slice(0, 3e4) || "\u6587\u4EF6\u5185\u5BB9\u4E3A\u7A7A\u3002";
  section.append(message, pre);
  panel.append(section);
}
function decodeDrawioDiagram(value) {
  try {
    const decoded = decodeURIComponent(escape(atob(value)));
    return pako2.inflateRaw(Uint8Array.from(decoded, (char) => char.charCodeAt(0)), {
      to: "string"
    });
  } catch {
    return value;
  }
}

// src/plugins/cad.ts
import pako3 from "pako";

// src/plugins/cad-dwg.ts
var libreDwgPromise;
var defaultLibreDwgWasmBaseUrl = "/vendor/libredwg-web";
var minReadableDrawingHeight = 420;
var libreDwgPackageName = "@mlightcad/libredwg-web";
var svgNumberPattern = /-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
async function renderLibreDwgPreview(ctx, options = {}) {
  if (ctx.extension !== "dwg" || options.enabled === false) {
    return void 0;
  }
  const shell = document.createElement("div");
  shell.className = "ofv-dwg-preview";
  const status = document.createElement("div");
  status.className = "ofv-dwg-preview-status";
  status.textContent = "Loading DWG rendering engine...";
  shell.append(status);
  ctx.panel.append(shell);
  try {
    const { LibreDwg, Dwg_File_Type } = await loadLibreDwg();
    const libredwg = await LibreDwg.create(options.wasmBaseUrl || defaultLibreDwgWasmBaseUrl);
    const data = libredwg.dwg_read_data(ctx.arrayBuffer, Dwg_File_Type.DWG);
    if (!data) {
      throw new Error("DWG parser did not return drawing data.");
    }
    let svg = "";
    let stats;
    let thumbnailUrl;
    try {
      thumbnailUrl = createDwgThumbnailUrl(readDwgThumbnail(libredwg, data));
      try {
        const result = libredwg.convertEx(data);
        const database = result.database;
        stats = createDwgPreviewStats(database, result.stats.unknownEntityCount, Boolean(thumbnailUrl));
        svg = libredwg.dwg_to_svg(database);
      } catch (error) {
        if (thumbnailUrl) {
          const fallbackThumbnailUrl = thumbnailUrl;
          status.replaceChildren(createDwgThumbnailFallbackStatus(ctx.fileName, error));
          shell.append(createDwgThumbnailPreview(fallbackThumbnailUrl, ctx.fileName));
          return {
            destroy() {
              URL.revokeObjectURL(fallbackThumbnailUrl);
              shell.remove();
            }
          };
        }
        throw error;
      }
    } finally {
      libredwg.dwg_free(data);
    }
    if (!svg || !/<svg[\s>]/i.test(svg)) {
      if (thumbnailUrl) {
        const fallbackThumbnailUrl = thumbnailUrl;
        status.replaceChildren(createDwgThumbnailFallbackStatus(ctx.fileName, "DWG parser finished but did not produce SVG output."));
        shell.append(createDwgThumbnailPreview(fallbackThumbnailUrl, ctx.fileName));
        return {
          destroy() {
            URL.revokeObjectURL(fallbackThumbnailUrl);
            shell.remove();
          }
        };
      }
      throw new Error("DWG parser finished but did not produce SVG output.");
    }
    const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
    const svgElement = doc.documentElement;
    if (!(svgElement instanceof SVGElement) || svgElement.nodeName.toLowerCase() !== "svg" || svgElement.querySelector("parsererror")) {
      throw new Error("DWG SVG output is invalid.");
    }
    svgElement.classList.add("ofv-dwg-preview-svg");
    svgElement.setAttribute("role", "img");
    svgElement.setAttribute("aria-label", ctx.fileName);
    normalizeDwgSvg(svgElement);
    const reliability = assessDwgSvgReliability(svgElement);
    status.replaceChildren(createDwgStatusTitle(ctx.fileName, stats, reliability));
    if (!reliability.isReliable && thumbnailUrl) {
      shell.append(createDwgThumbnailPreview(thumbnailUrl, ctx.fileName));
      return {
        destroy() {
          URL.revokeObjectURL(thumbnailUrl);
          shell.remove();
        }
      };
    }
    const drawing = createDwgDrawingViewport(svgElement);
    if (thumbnailUrl) {
      shell.append(createDwgThumbnailPanel(thumbnailUrl));
    }
    shell.append(drawing.frame);
    return {
      resize() {
        drawing.update();
      },
      canCommand(command) {
        return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset";
      },
      command(command) {
        if (command === "zoom-in") {
          drawing.setZoom(drawing.zoom * 1.18);
          return true;
        }
        if (command === "zoom-out") {
          drawing.setZoom(drawing.zoom / 1.18);
          return true;
        }
        if (command === "zoom-reset") {
          drawing.setZoom(1);
          return true;
        }
        return false;
      },
      destroy() {
        if (thumbnailUrl) {
          URL.revokeObjectURL(thumbnailUrl);
        }
        shell.remove();
      }
    };
  } catch (error) {
    shell.remove();
    console.warn("DWG LibreDWG preview failed, falling back to metadata preview:", error);
    return void 0;
  }
}
function loadLibreDwg() {
  libreDwgPromise ||= importOptionalModule2(libreDwgPackageName);
  return libreDwgPromise;
}
function importOptionalModule2(packageName) {
  return new Function("packageName", "return import(packageName)")(packageName);
}
function createDwgStatusTitle(fileName, stats, reliability) {
  const wrapper = document.createElement("span");
  const title = document.createElement("strong");
  const note = document.createElement("small");
  title.textContent = reliability.isReliable ? `\u5B9E\u9A8C\u6027 DWG \u6A21\u578B\u7A7A\u95F4\u9884\u89C8 \xB7 ${fileName}` : `DWG \u5185\u7F6E\u9884\u89C8\u56FE \xB7 ${fileName}`;
  note.textContent = [
    `${stats.entityCount.toLocaleString()} \u4E2A\u5B9E\u4F53`,
    `${stats.visibleLayerCount}/${stats.layerCount} \u4E2A\u53EF\u89C1\u56FE\u5C42`,
    `${stats.layoutCount} \u4E2A\u5E03\u5C40`,
    stats.paperSpaceEntityCount ? `${stats.paperSpaceEntityCount.toLocaleString()} \u4E2A\u56FE\u7EB8\u7A7A\u95F4\u5B9E\u4F53` : "\u6A21\u578B\u7A7A\u95F4\u7EBF\u7A3F",
    stats.unknownEntityCount ? `${stats.unknownEntityCount} \u4E2A\u672A\u77E5\u5B9E\u4F53` : "\u5B9E\u4F53\u89E3\u6790\u5B8C\u6574",
    stats.hasThumbnail ? "\u5305\u542B\u5185\u7F6E\u7F29\u7565\u56FE" : "\u65E0\u5185\u7F6E\u7F29\u7565\u56FE"
  ].join(" \xB7 ");
  const warning = document.createElement("small");
  warning.textContent = reliability.isReliable ? "\u5F53\u524D\u4E3A LibreDWG WASM \u7EBF\u7A3F\u9884\u89C8\uFF0C\u590D\u6742\u5E03\u5C40/\u6253\u5370\u7A7A\u95F4/\u5B57\u4F53/\u586B\u5145\u4E0E\u4E13\u4E1A CAD \u4ECD\u53EF\u80FD\u5B58\u5728\u5DEE\u5F02\u3002" : `LibreDWG \u7EBF\u7A3F\u68C0\u6D4B\u5230\u5F02\u5E38\u56FE\u5143\uFF0C\u5DF2\u4F18\u5148\u663E\u793A\u6587\u4EF6\u5185\u7F6E\u9884\u89C8\u56FE\u3002${reliability.reason ?? ""}`;
  wrapper.append(title, note, warning);
  return wrapper;
}
function createDwgThumbnailFallbackStatus(fileName, error) {
  const wrapper = document.createElement("span");
  const title = document.createElement("strong");
  title.textContent = `DWG \u5185\u7F6E\u9884\u89C8\u56FE \xB7 ${fileName}`;
  const note = document.createElement("small");
  note.textContent = "LibreDWG \u5DF2\u8BFB\u53D6\u5230\u6587\u4EF6\u5185\u7F6E\u7F29\u7565\u56FE\uFF0C\u4F46\u7EBF\u7A3F\u9884\u89C8\u672A\u80FD\u751F\u6210\uFF0C\u5DF2\u81EA\u52A8\u5207\u6362\u4E3A\u7F29\u7565\u56FE\u515C\u5E95\u3002";
  const detail = document.createElement("small");
  detail.textContent = error instanceof Error ? error.message : String(error || "\u672A\u77E5\u89E3\u6790\u9519\u8BEF");
  wrapper.append(title, note, detail);
  return wrapper;
}
function createDwgPreviewStats(database, unknownEntityCount, hasThumbnail) {
  const layers = database.tables.LAYER.entries;
  return {
    entityCount: database.entities.length,
    layerCount: layers.length,
    layoutCount: database.objects.LAYOUT.length,
    unknownEntityCount,
    visibleLayerCount: layers.filter((layer) => !layer.off && !layer.frozen).length,
    paperSpaceEntityCount: database.entities.filter((entity) => entity.isInPaperSpace).length,
    hasThumbnail
  };
}
function readDwgThumbnail(libredwg, data) {
  try {
    const thumbnail = libredwg.dwg_bmp(data);
    if (!thumbnail?.data?.length) {
      return void 0;
    }
    return thumbnail;
  } catch {
    return void 0;
  }
}
function createDwgThumbnailUrl(thumbnail) {
  if (!thumbnail) {
    return void 0;
  }
  if (thumbnail.type === 6) {
    return URL.createObjectURL(new Blob([toArrayBuffer2(thumbnail.data)], { type: "image/png" }));
  }
  if (thumbnail.type === 2) {
    return URL.createObjectURL(new Blob([toArrayBuffer2(createBmpFileBytes(thumbnail.data))], { type: "image/bmp" }));
  }
  return void 0;
}
function toArrayBuffer2(bytes) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}
function createBmpFileBytes(dibBytes) {
  const view3 = new DataView(dibBytes.buffer, dibBytes.byteOffset, dibBytes.byteLength);
  const headerSize = view3.getUint32(0, true);
  const bitCount = view3.getUint16(14, true);
  const paletteBytes = bitCount <= 8 ? 2 ** bitCount * 4 : 0;
  const pixelOffset = 14 + headerSize + paletteBytes;
  const bytes = new Uint8Array(14 + dibBytes.byteLength);
  bytes[0] = 66;
  bytes[1] = 77;
  const fileView = new DataView(bytes.buffer);
  fileView.setUint32(2, bytes.byteLength, true);
  fileView.setUint32(10, pixelOffset, true);
  bytes.set(dibBytes, 14);
  return bytes;
}
function createDwgThumbnailPanel(thumbnailUrl) {
  const panel = document.createElement("figure");
  panel.className = "ofv-dwg-thumbnail";
  const image = document.createElement("img");
  image.src = thumbnailUrl;
  image.alt = "DWG \u6587\u4EF6\u5185\u7F6E\u7F29\u7565\u56FE";
  const caption = document.createElement("figcaption");
  caption.textContent = "\u6587\u4EF6\u5185\u7F6E\u7F29\u7565\u56FE";
  panel.append(image, caption);
  return panel;
}
function createDwgThumbnailPreview(thumbnailUrl, fileName) {
  const figure = document.createElement("figure");
  figure.className = "ofv-dwg-thumbnail-preview";
  const image = document.createElement("img");
  image.src = thumbnailUrl;
  image.alt = `${fileName} \u5185\u7F6E\u9884\u89C8\u56FE`;
  const caption = document.createElement("figcaption");
  caption.textContent = "DWG \u6587\u4EF6\u5185\u7F6E\u9884\u89C8\u56FE\u3002\u82E5\u9700\u8981\u63A5\u8FD1 CAD \u5E03\u5C40/\u6253\u5370\u7A7A\u95F4\u7684\u9AD8\u4FDD\u771F\u6548\u679C\uFF0C\u8BF7\u4F7F\u7528\u540C\u540D PNG\u3001SVG\u3001PDF \u5BFC\u51FA\u56FE\uFF0C\u6216\u901A\u8FC7 binaryRenderer \u63A5\u5165\u4E13\u4E1A CAD \u6E32\u67D3/\u8F6C\u6362\u670D\u52A1\u3002";
  figure.append(image, caption);
  return figure;
}
function normalizeDwgSvg(svgElement) {
  svgElement.setAttribute("preserveAspectRatio", "xMidYMid meet");
  removeInheritedDwgFills(svgElement);
  focusDwgSvgOnMainDrawing(svgElement);
  const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
  style.textContent = `
    .ofv-dwg-preview-svg { background: #020617; }
    .ofv-dwg-preview-svg g {
      fill: none !important;
    }
    .ofv-dwg-preview-svg line,
    .ofv-dwg-preview-svg path,
    .ofv-dwg-preview-svg polyline,
    .ofv-dwg-preview-svg polygon,
    .ofv-dwg-preview-svg circle,
    .ofv-dwg-preview-svg ellipse,
    .ofv-dwg-preview-svg rect {
      fill: none !important;
      vector-effect: non-scaling-stroke;
      stroke-width: 0.7px !important;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .ofv-dwg-preview-svg [stroke="rgb(0,255,0)"] {
      stroke: #34d399 !important;
      stroke-opacity: 0.58 !important;
    }
    .ofv-dwg-preview-svg text {
      vector-effect: non-scaling-stroke;
      stroke-width: 0 !important;
      fill: currentColor !important;
    }
  `;
  svgElement.prepend(style);
}
function removeInheritedDwgFills(svgElement) {
  const shapeSelector = "line,path,polyline,polygon,circle,ellipse,rect";
  for (const group of svgElement.querySelectorAll("g[fill]")) {
    group.setAttribute("fill", "none");
  }
  for (const styledElement of svgElement.querySelectorAll("[style]")) {
    styledElement.style.fill = "none";
  }
  for (const shape of svgElement.querySelectorAll(shapeSelector)) {
    shape.setAttribute("fill", "none");
  }
}
function assessDwgSvgReliability(svgElement) {
  const bounds = readSvgViewBox(svgElement);
  if (!bounds) {
    return { isReliable: true };
  }
  const largePathCount = countLargeSvgPaths(svgElement, bounds);
  const totalPathCount = svgElement.querySelectorAll("path").length;
  if (largePathCount >= 24 && totalPathCount > 0 && largePathCount / totalPathCount > 0.08) {
    return {
      isReliable: false,
      reason: "\u8BE5\u6587\u4EF6\u5305\u542B\u5927\u91CF\u8D85\u51FA\u4E3B\u4F53\u89C6\u53E3\u7684\u5927\u8DEF\u5F84/\u5757\u53C2\u7167\uFF0C\u7EBF\u7A3F\u6A21\u5F0F\u4F1A\u660E\u663E\u504F\u79BB CAD \u5E03\u5C40\u3002"
    };
  }
  return { isReliable: true };
}
function countLargeSvgPaths(svgElement, bounds) {
  let count = 0;
  const viewportArea = bounds.width * bounds.height;
  if (!Number.isFinite(viewportArea) || viewportArea <= 0) {
    return count;
  }
  for (const path of svgElement.querySelectorAll("path")) {
    if (path.closest("defs")) {
      continue;
    }
    const pathBounds = estimatePathBounds(path);
    if (!pathBounds) {
      continue;
    }
    const pathArea = pathBounds.width * pathBounds.height;
    const crossesViewport = pathBounds.minX <= bounds.minX + bounds.width * 0.02 || pathBounds.minY <= bounds.minY + bounds.height * 0.02;
    if (pathArea > viewportArea * 0.28 || crossesViewport && pathArea > viewportArea * 0.12) {
      count += 1;
    }
  }
  return count;
}
function estimatePathBounds(path) {
  const numbers = readNumbers(path.getAttribute("d") ?? "");
  if (numbers.length < 4) {
    return void 0;
  }
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (let index = 0; index + 1 < numbers.length; index += 2) {
    const x = numbers[index];
    const y = numbers[index + 1];
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 1e9 || Math.abs(y) > 1e9) {
      continue;
    }
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }
  if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
    return void 0;
  }
  return { minX, minY, width: maxX - minX, height: maxY - minY };
}
function focusDwgSvgOnMainDrawing(svgElement) {
  const originalBounds = readSvgViewBox(svgElement);
  const mainBounds = estimateMainDrawingBounds(svgElement);
  if (!originalBounds || !mainBounds || !shouldUseMainDrawingBounds(originalBounds, mainBounds)) {
    return;
  }
  const paddedBounds = padBounds(mainBounds, 0.05);
  svgElement.dataset.originalViewBox = formatViewBox(originalBounds);
  svgElement.dataset.focusViewBox = formatViewBox(paddedBounds);
  svgElement.setAttribute("viewBox", formatViewBox(paddedBounds));
}
function shouldUseMainDrawingBounds(original, candidate) {
  const originalAspectRatio = original.width / original.height;
  const candidateAspectRatio = candidate.width / candidate.height;
  const originalArea = original.width * original.height;
  const candidateArea = candidate.width * candidate.height;
  if (!Number.isFinite(originalArea) || !Number.isFinite(candidateArea) || candidateArea <= 0) {
    return false;
  }
  return originalAspectRatio > 8 || originalAspectRatio < 0.125 || candidateArea / originalArea < 0.55 || Math.abs(Math.log(originalAspectRatio / candidateAspectRatio)) > Math.log(4);
}
function estimateMainDrawingBounds(svgElement) {
  const points = [];
  const addPoint = (x, y) => {
    if (Number.isFinite(x) && Number.isFinite(y) && Math.abs(x) < 1e9 && Math.abs(y) < 1e9) {
      points.push([x, y]);
    }
  };
  for (const element of svgElement.querySelectorAll("line,path,polyline,polygon,circle,ellipse,rect,text,use")) {
    if (element.closest("defs")) {
      continue;
    }
    collectElementPoints(element, addPoint);
  }
  if (points.length < 16) {
    return void 0;
  }
  const xs = points.map(([x]) => x).sort((a, b) => a - b);
  const ys = points.map(([, y]) => y).sort((a, b) => a - b);
  const minX = quantile(xs, 5e-3);
  const maxX = quantile(xs, 0.995);
  const minY = quantile(ys, 5e-3);
  const maxY = quantile(ys, 0.995);
  if (!Number.isFinite(minX) || !Number.isFinite(maxX) || !Number.isFinite(minY) || !Number.isFinite(maxY)) {
    return void 0;
  }
  const width = maxX - minX;
  const height = maxY - minY;
  if (width <= 0 || height <= 0) {
    return void 0;
  }
  return { minX, minY, width, height };
}
function collectElementPoints(element, addPoint) {
  const tagName = element.tagName.toLowerCase();
  if (tagName === "line") {
    addPoint(readNumberAttribute(element, "x1"), readNumberAttribute(element, "y1"));
    addPoint(readNumberAttribute(element, "x2"), readNumberAttribute(element, "y2"));
  } else if (tagName === "circle") {
    const cx = readNumberAttribute(element, "cx");
    const cy = readNumberAttribute(element, "cy");
    const r = readNumberAttribute(element, "r");
    addPoint(cx - r, cy - r);
    addPoint(cx + r, cy + r);
  } else if (tagName === "ellipse") {
    const cx = readNumberAttribute(element, "cx");
    const cy = readNumberAttribute(element, "cy");
    const rx = readNumberAttribute(element, "rx");
    const ry = readNumberAttribute(element, "ry");
    addPoint(cx - rx, cy - ry);
    addPoint(cx + rx, cy + ry);
  } else if (tagName === "rect") {
    const x = readNumberAttribute(element, "x");
    const y = readNumberAttribute(element, "y");
    addPoint(x, y);
    addPoint(x + readNumberAttribute(element, "width"), y + readNumberAttribute(element, "height"));
  } else if (tagName === "text") {
    addPoint(readNumberAttribute(element, "x"), readNumberAttribute(element, "y"));
  } else if (tagName === "path") {
    collectNumberPairs(element.getAttribute("d"), addPoint);
  } else if (tagName === "polyline" || tagName === "polygon") {
    collectNumberPairs(element.getAttribute("points"), addPoint);
  }
  collectTranslatePoints(element.getAttribute("transform"), addPoint);
}
function collectNumberPairs(value, addPoint) {
  if (!value) {
    return;
  }
  const numbers = readNumbers(value);
  for (let index = 0; index + 1 < numbers.length; index += 2) {
    addPoint(numbers[index], numbers[index + 1]);
  }
}
function collectTranslatePoints(value, addPoint) {
  if (!value) {
    return;
  }
  const translatePattern = /translate\(\s*(-?\d*\.?\d+(?:e[-+]?\d+)?)(?:[\s,]+(-?\d*\.?\d+(?:e[-+]?\d+)?))?/gi;
  for (const match of value.matchAll(translatePattern)) {
    addPoint(Number(match[1]), Number(match[2] ?? 0));
  }
}
function readNumbers(value) {
  const matches = value.match(svgNumberPattern);
  return matches ? matches.map((item) => Number(item)).filter(Number.isFinite) : [];
}
function readNumberAttribute(element, name) {
  const value = Number(element.getAttribute(name) ?? 0);
  return Number.isFinite(value) ? value : 0;
}
function quantile(values, ratio) {
  const index = Math.max(0, Math.min(values.length - 1, Math.floor((values.length - 1) * ratio)));
  return values[index];
}
function padBounds(bounds, ratio) {
  const paddingX = bounds.width * ratio;
  const paddingY = bounds.height * ratio;
  return {
    minX: bounds.minX - paddingX,
    minY: bounds.minY - paddingY,
    width: bounds.width + paddingX * 2,
    height: bounds.height + paddingY * 2
  };
}
function formatViewBox(bounds) {
  return [bounds.minX, bounds.minY, bounds.width, bounds.height].map((value) => Number(value.toFixed(4))).join(" ");
}
function createDwgDrawingViewport(svgElement) {
  const frame = document.createElement("div");
  frame.className = "ofv-dwg-preview-frame";
  const importedSvg = document.importNode(svgElement, true);
  frame.append(importedSvg);
  const aspectRatio = readSvgAspectRatio(svgElement);
  let zoom = 1;
  const update = () => {
    const frameWidth = Math.max(frame.clientWidth, 1);
    const readableWidth = aspectRatio ? minReadableDrawingHeight * aspectRatio : frameWidth;
    const width = Math.max(frameWidth, readableWidth) * zoom;
    importedSvg.style.width = `${Math.round(width)}px`;
    importedSvg.style.minWidth = `${Math.round(width)}px`;
  };
  const setZoom = (nextZoom) => {
    zoom = Math.min(Math.max(nextZoom, 0.2), 8);
    update();
  };
  requestAnimationFrame(update);
  return {
    frame,
    get zoom() {
      return zoom;
    },
    setZoom,
    update
  };
}
function readSvgAspectRatio(svgElement) {
  const viewBox = readSvgViewBox(svgElement);
  return viewBox ? viewBox.width / viewBox.height : void 0;
}
function readSvgViewBox(svgElement) {
  const viewBox = svgElement.getAttribute("viewBox");
  if (!viewBox) {
    return void 0;
  }
  const [minX, minY, width, height] = viewBox.trim().split(/[\s,]+/).map((value) => Number(value));
  if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    return void 0;
  }
  return { minX, minY, width, height };
}

// src/plugins/cad.ts
var cadExtensions = /* @__PURE__ */ new Set([
  "dxf",
  "dwg",
  "dwf",
  "step",
  "stp",
  "iges",
  "igs",
  "ifc",
  "sat",
  "sab",
  "x_t",
  "x_b",
  "3dm",
  "skp",
  "sldprt",
  "sldasm",
  "gds",
  "oas",
  "oasis"
]);
var cadMimeTypes = /* @__PURE__ */ new Set([
  "application/acad",
  "application/dxf",
  "application/x-dxf",
  "image/vnd.dxf",
  "model/vnd.dwf",
  "model/step",
  "application/step",
  "application/iges",
  "application/x-step",
  "application/sat",
  "application/sab",
  "application/x-parasolid",
  "model/vnd.3dm",
  "application/vnd.sketchup.skp",
  "application/sldworks",
  "application/vnd.gds",
  "application/x-gdsii",
  "application/vnd.oasis.layout",
  "application/x-oasis-layout"
]);
var cadMimeFormatMap = {
  "application/acad": "dwg",
  "application/dxf": "dxf",
  "application/x-dxf": "dxf",
  "image/vnd.dxf": "dxf",
  "model/vnd.dwf": "dwf",
  "model/step": "step",
  "application/step": "step",
  "application/iges": "iges",
  "application/x-step": "ifc",
  "application/sat": "sat",
  "application/sab": "sab",
  "application/x-parasolid": "x_t",
  "model/vnd.3dm": "3dm",
  "application/vnd.sketchup.skp": "skp",
  "application/sldworks": "sldprt",
  "application/vnd.gds": "gds",
  "application/x-gdsii": "gds",
  "application/vnd.oasis.layout": "oas",
  "application/x-oasis-layout": "oas"
};
function cadPlugin(options = {}) {
  return {
    name: "cad",
    match(file) {
      return cadExtensions.has(file.extension) || cadMimeTypes.has(file.mimeType);
    },
    async render(ctx) {
      const panel = createPanel("ofv-cad");
      ctx.viewport.append(panel);
      const extension = resolveFormat(ctx.file, cadMimeFormatMap);
      if (extension === "step" || extension === "stp") {
        const viewer2 = renderStep(panel, await readTextFile(ctx.file), extension, ctx);
        return createCadInstance(panel, viewer2);
      }
      if (extension === "iges" || extension === "igs") {
        const viewer2 = renderIges(panel, await readTextFile(ctx.file), extension, ctx);
        return createCadInstance(panel, viewer2);
      }
      if (extension === "ifc") {
        renderIfc(panel, await readTextFile(ctx.file));
        return { destroy: () => panel.remove() };
      }
      if (extension === "sat") {
        const viewer2 = renderAcisSat(panel, await readTextFile(ctx.file), extension, ctx);
        return createCadInstance(panel, viewer2);
      }
      if (extension === "x_t") {
        const viewer2 = renderParasolidText(panel, await readTextFile(ctx.file), extension, ctx);
        return createCadInstance(panel, viewer2);
      }
      if (extension === "dwg" || extension === "dwf") {
        const arrayBuffer = await readArrayBuffer(ctx.file);
        const bytes = new Uint8Array(arrayBuffer);
        const enhancedInstance = await options.binaryRenderer?.({
          panel,
          fileName: ctx.file.name,
          extension,
          arrayBuffer,
          bytes,
          preview: ctx
        });
        if (enhancedInstance) {
          return {
            resize(size) {
              enhancedInstance.resize?.(size);
            },
            canCommand(command) {
              return enhancedInstance.canCommand?.(command) ?? false;
            },
            command(command) {
              return enhancedInstance.command?.(command);
            },
            destroy() {
              enhancedInstance.destroy();
              panel.remove();
            }
          };
        }
        if (extension === "dwg" && options.libreDwg !== false) {
          const libreDwgInstance = await renderLibreDwgPreview(
            {
              panel,
              fileName: ctx.file.name,
              extension,
              arrayBuffer,
              bytes,
              preview: ctx
            },
            typeof options.libreDwg === "object" ? options.libreDwg : void 0
          );
          if (libreDwgInstance) {
            return {
              resize(size) {
                libreDwgInstance.resize?.(size);
              },
              canCommand(command) {
                return libreDwgInstance.canCommand?.(command) ?? false;
              },
              command(command) {
                return libreDwgInstance.command?.(command);
              },
              destroy() {
                libreDwgInstance.destroy();
                panel.remove();
              }
            };
          }
        }
        renderBinaryCad(panel, bytes, extension, ctx.file.name);
        return { destroy: () => panel.remove() };
      }
      if (extension === "gds") {
        const viewer2 = renderLayoutPreview(panel, parseGdsLayout(new Uint8Array(await readArrayBuffer(ctx.file)), ctx.file.name), ctx);
        return {
          canCommand(command) {
            return viewer2.canCommand(command);
          },
          command(command) {
            return viewer2.command(command);
          },
          destroy() {
            viewer2.destroy();
            panel.remove();
          }
        };
      }
      if (extension === "oas" || extension === "oasis") {
        const viewer2 = renderLayoutPreview(panel, parseOasisLayout(new Uint8Array(await readArrayBuffer(ctx.file)), ctx.file.name), ctx);
        return {
          canCommand(command) {
            return viewer2.canCommand(command);
          },
          command(command) {
            return viewer2.command(command);
          },
          destroy() {
            viewer2.destroy();
            panel.remove();
          }
        };
      }
      if (extension !== "dxf") {
        const section = createUnsupportedCadSection(extension, ctx.file.name);
        panel.append(section);
        return { destroy: () => panel.remove() };
      }
      const dxf = await readTextFile(ctx.file);
      const viewer = renderDxf(panel, dxf, ctx);
      return {
        canCommand(command) {
          return viewer.canCommand(command);
        },
        command(command) {
          return viewer.command(command);
        },
        destroy() {
          panel.remove();
        }
      };
    }
  };
}
function createCadInstance(panel, viewer) {
  return {
    canCommand(command) {
      return viewer?.canCommand(command) ?? false;
    },
    command(command) {
      return viewer?.command(command) ?? false;
    },
    destroy() {
      viewer?.destroy();
      panel.remove();
    }
  };
}
function renderStep(panel, text, extension, ctx) {
  const records = parseStepRecords(text);
  const typeCounts = countBy(records.map((record) => record.type));
  const geometry = createCadGeometryPreview(extractStepGeometry(records), "STEP \u8F7B\u91CF\u51E0\u4F55\u9884\u89C8");
  const section = createSection(geometry ? `${extension.toUpperCase()} \u8F7B\u91CF\u51E0\u4F55\u9884\u89C8` : `${extension.toUpperCase()} \u7ED3\u6784\u9884\u89C8`);
  const note = document.createElement("p");
  note.textContent = "\u5F53\u524D\u7248\u672C\u63D0\u53D6 STEP \u6587\u672C\u5B9E\u4F53\u3001\u7C7B\u578B\u7EDF\u8BA1\u548C\u5173\u952E\u51E0\u4F55\u53C2\u6570\u3002\u7CBE\u786E B-Rep/\u66F2\u9762\u6E32\u67D3\u5EFA\u8BAE\u540E\u7EED\u63A5\u5165 CAD \u5185\u6838\u6216\u670D\u52A1\u7AEF\u8F6C\u6362\u3002";
  const meta = document.createElement("div");
  meta.className = "ofv-cad-summary";
  appendMeta5(meta, "\u5B9E\u4F53", records.length);
  appendMeta5(meta, "\u7C7B\u578B", typeCounts.size);
  appendMeta5(meta, "\u70B9", typeCounts.get("CARTESIAN_POINT") || 0);
  appendMeta5(meta, "\u65B9\u5411", typeCounts.get("DIRECTION") || 0);
  const typeList = createCadTypeList(typeCounts);
  section.append(note, meta, typeList);
  let viewer;
  if (geometry) {
    hideSuccessfulSectionHeading3(section);
    hideSupplementalInfo7(note);
    hideSupplementalInfo7(meta);
    hideSupplementalInfo7(typeList);
    section.append(geometry.element);
    viewer = createGeometryViewer(geometry.svg, geometry.bounds, ctx);
  }
  const table = createCadEntityTable(
    records.slice(0, 200).map((record) => ({
      id: record.id,
      type: record.type,
      detail: summarizeStepRecord(record)
    }))
  );
  if (geometry) {
    hideSupplementalInfo7(table);
  }
  section.append(table);
  panel.append(section);
  return viewer;
}
function renderIges(panel, text, extension, ctx) {
  const records = parseIgesRecords(text);
  const typeCounts = countBy(records.map((record) => record.type));
  const geometry = createCadGeometryPreview(extractIgesGeometry(records), "IGES \u8F7B\u91CF\u51E0\u4F55\u9884\u89C8");
  const section = createSection(geometry ? `${extension.toUpperCase()} \u8F7B\u91CF\u51E0\u4F55\u9884\u89C8` : `${extension.toUpperCase()} \u7ED3\u6784\u9884\u89C8`);
  const note = document.createElement("p");
  note.textContent = "\u5F53\u524D\u7248\u672C\u63D0\u53D6 IGES \u53C2\u6570\u533A\u5B9E\u4F53\u3001\u7C7B\u578B\u7EDF\u8BA1\u548C\u57FA\u7840\u53C2\u6570\u3002\u7CBE\u786E\u66F2\u7EBF/\u66F2\u9762\u6E32\u67D3\u5EFA\u8BAE\u540E\u7EED\u63A5\u5165 CAD \u5185\u6838\u6216\u670D\u52A1\u7AEF\u8F6C\u6362\u3002";
  const meta = document.createElement("div");
  meta.className = "ofv-cad-summary";
  appendMeta5(meta, "\u5B9E\u4F53", records.length);
  appendMeta5(meta, "\u7C7B\u578B", typeCounts.size);
  appendMeta5(meta, "\u70B9\u5B9E\u4F53", typeCounts.get("116") || 0);
  appendMeta5(meta, "\u7EBF\u5B9E\u4F53", typeCounts.get("110") || 0);
  const typeList = createCadTypeList(typeCounts, "\u7C7B\u578B\u53F7\u7EDF\u8BA1");
  section.append(note, meta, typeList);
  let viewer;
  if (geometry) {
    hideSuccessfulSectionHeading3(section);
    hideSupplementalInfo7(note);
    hideSupplementalInfo7(meta);
    hideSupplementalInfo7(typeList);
    section.append(geometry.element);
    viewer = createGeometryViewer(geometry.svg, geometry.bounds, ctx);
  }
  const table = createCadEntityTable(
    records.slice(0, 200).map((record, index) => ({
      id: String(index + 1),
      type: igesTypeName(record.type),
      detail: record.params.slice(0, 8).join(", ")
    }))
  );
  if (geometry) {
    hideSupplementalInfo7(table);
  }
  section.append(table);
  panel.append(section);
  return viewer;
}
function renderIfc(panel, text) {
  const records = parseStepRecords(text);
  const typeCounts = countBy(records.map((record) => record.type));
  const section = createSection("IFC BIM \u7ED3\u6784\u9884\u89C8");
  const note = document.createElement("p");
  note.textContent = "\u5F53\u524D\u7248\u672C\u63D0\u53D6 IFC STEP \u5B9E\u4F53\u3001BIM \u5C42\u7EA7\u548C\u5E38\u89C1\u6784\u4EF6\u7EDF\u8BA1\u3002\u51E0\u4F55\u7F51\u683C\u3001\u6750\u8D28\u548C\u5C5E\u6027\u96C6\u53EF\u540E\u7EED\u63A5\u5165 IfcOpenShell/IFC.js \u589E\u5F3A\u3002";
  const meta = document.createElement("div");
  meta.className = "ofv-cad-summary";
  appendMeta5(meta, "\u5B9E\u4F53", records.length);
  appendMeta5(meta, "\u7C7B\u578B", typeCounts.size);
  appendMeta5(meta, "\u9879\u76EE", typeCounts.get("IFCPROJECT") || 0);
  appendMeta5(meta, "\u5EFA\u7B51", typeCounts.get("IFCBUILDING") || 0);
  appendMeta5(meta, "\u697C\u5C42", typeCounts.get("IFCBUILDINGSTOREY") || 0);
  appendMeta5(meta, "\u7A7A\u95F4", typeCounts.get("IFCSPACE") || 0);
  appendMeta5(meta, "\u6784\u4EF6", countIfcElements(typeCounts));
  section.append(note, meta, createCadTypeList(typeCounts, "IFC \u5B9E\u4F53\u7EDF\u8BA1"));
  const hierarchy = createIfcHierarchy(records);
  if (hierarchy) {
    section.append(hierarchy);
  }
  const table = createCadEntityTable(
    records.slice(0, 240).map((record) => ({
      id: record.id,
      type: record.type,
      detail: summarizeIfcRecord(record)
    }))
  );
  section.append(table);
  panel.append(section);
}
function renderAcisSat(panel, text, extension, ctx) {
  const records = parseAcisSatRecords(text);
  const typeCounts = countBy(records.map((record) => record.type));
  const geometry = createCadGeometryPreview(extractAcisSatGeometry(records), "SAT \u8F7B\u91CF\u51E0\u4F55\u9884\u89C8");
  const section = createSection(geometry ? `${extension.toUpperCase()} ACIS \u8F7B\u91CF\u51E0\u4F55\u9884\u89C8` : `${extension.toUpperCase()} ACIS \u7ED3\u6784\u9884\u89C8`);
  const note = document.createElement("p");
  note.textContent = "\u5F53\u524D\u7248\u672C\u4F1A\u5728\u524D\u7AEF\u89E3\u6790 ACIS SAT \u6587\u672C\u5B9E\u4F53\u3001\u7C7B\u578B\u7EDF\u8BA1\u548C\u5E38\u89C1 vertex/straight-curve \u51E0\u4F55\u7EBF\u7D22\uFF1B\u7CBE\u786E\u66F2\u9762\u3001\u62D3\u6251\u548C\u5E03\u5C14\u4F53\u4ECD\u5EFA\u8BAE\u63A5\u5165 CAD \u5185\u6838\u589E\u5F3A\u3002";
  const meta = document.createElement("div");
  meta.className = "ofv-cad-summary";
  appendMeta5(meta, "\u5B9E\u4F53", records.length);
  appendMeta5(meta, "\u7C7B\u578B", typeCounts.size);
  appendMeta5(meta, "\u9876\u70B9", typeCounts.get("vertex") || 0);
  appendMeta5(meta, "\u76F4\u7EBF", typeCounts.get("straight-curve") || 0);
  const typeList = createCadTypeList(typeCounts);
  section.append(note, meta, typeList);
  let viewer;
  if (geometry) {
    hideSuccessfulSectionHeading3(section);
    hideSupplementalInfo7(note);
    hideSupplementalInfo7(meta);
    hideSupplementalInfo7(typeList);
    section.append(geometry.element);
    viewer = createGeometryViewer(geometry.svg, geometry.bounds, ctx);
  }
  const table = createCadEntityTable(
    records.slice(0, 200).map((record) => ({
      id: record.id,
      type: record.type,
      detail: summarizeAcisRecord(record)
    }))
  );
  if (geometry) {
    hideSupplementalInfo7(table);
  }
  section.append(table);
  panel.append(section);
  return viewer;
}
function renderParasolidText(panel, text, extension, ctx) {
  const records = parseParasolidTextRecords(text);
  const typeCounts = countBy(records.map((record) => record.type));
  const geometry = createCadGeometryPreview(extractParasolidTextGeometry(records), "Parasolid \u8F7B\u91CF\u51E0\u4F55\u9884\u89C8");
  const section = createSection(
    geometry ? `${extension.toUpperCase()} Parasolid \u8F7B\u91CF\u51E0\u4F55\u9884\u89C8` : `${extension.toUpperCase()} Parasolid \u6587\u672C\u9884\u89C8`
  );
  const note = document.createElement("p");
  note.textContent = "\u5F53\u524D\u7248\u672C\u4F1A\u5728\u524D\u7AEF\u89E3\u6790 Parasolid x_t \u6587\u672C\u7247\u6BB5\u3001\u5B9E\u4F53\u7C7B\u578B\u3001\u5750\u6807\u70B9\u548C\u57FA\u7840\u7EBF\u6BB5\u7EBF\u7D22\uFF1B\u5B8C\u6574 B-Rep\u3001\u66F2\u9762\u548C\u88C5\u914D\u5173\u7CFB\u5EFA\u8BAE\u63A5\u5165 Parasolid/HOOPS/ODA \u7B49\u4E13\u4E1A\u5185\u6838\u3002";
  const meta = document.createElement("div");
  meta.className = "ofv-cad-summary";
  appendMeta5(meta, "\u5B9E\u4F53", records.length);
  appendMeta5(meta, "\u7C7B\u578B", typeCounts.size);
  appendMeta5(meta, "\u70B9", typeCounts.get("point") || typeCounts.get("vertex") || 0);
  appendMeta5(meta, "\u66F2\u7EBF", (typeCounts.get("line") || 0) + (typeCounts.get("curve") || 0));
  const typeList = createCadTypeList(typeCounts);
  section.append(note, meta, typeList);
  let viewer;
  if (geometry) {
    hideSuccessfulSectionHeading3(section);
    hideSupplementalInfo7(note);
    hideSupplementalInfo7(meta);
    hideSupplementalInfo7(typeList);
    section.append(geometry.element);
    viewer = createGeometryViewer(geometry.svg, geometry.bounds, ctx);
  }
  const table = createCadEntityTable(
    records.slice(0, 200).map((record) => ({
      id: record.id,
      type: record.type,
      detail: summarizeParasolidRecord(record)
    }))
  );
  if (geometry) {
    hideSupplementalInfo7(table);
  }
  section.append(table);
  panel.append(section);
  return viewer;
}
var layoutPalette = [
  "#2563eb",
  "#dc2626",
  "#059669",
  "#7c3aed",
  "#d97706",
  "#0891b2",
  "#be123c",
  "#4f46e5",
  "#15803d",
  "#a16207"
];
var gdsRecordNames = {
  0: "HEADER",
  1: "BGNLIB",
  2: "LIBNAME",
  3: "UNITS",
  4: "ENDLIB",
  5: "BGNSTR",
  6: "STRNAME",
  7: "ENDSTR",
  8: "BOUNDARY",
  9: "PATH",
  10: "SREF",
  11: "AREF",
  12: "TEXT",
  13: "LAYER",
  14: "DATATYPE",
  15: "WIDTH",
  16: "XY",
  17: "ENDEL",
  18: "SNAME",
  19: "COLROW",
  22: "TEXTTYPE",
  25: "STRING",
  45: "BOX"
};
var oasisRecordNames = {
  0: "PAD",
  1: "START",
  2: "END",
  3: "CELLNAME",
  4: "CELLNAME-REF",
  5: "TEXTSTRING",
  6: "TEXTSTRING-REF",
  7: "PROPNAME",
  8: "PROPNAME-REF",
  9: "PROPSTRING",
  10: "PROPSTRING-REF",
  11: "LAYERNAME",
  12: "LAYERNAME-REF",
  13: "CELL",
  14: "XYABSOLUTE",
  15: "XYRELATIVE",
  16: "PLACEMENT",
  17: "PLACEMENT",
  18: "TEXT",
  19: "RECTANGLE",
  20: "POLYGON",
  21: "PATH",
  22: "TRAPEZOID",
  23: "TRAPEZOID",
  24: "TRAPEZOID",
  25: "CTRAPEZOID",
  26: "CIRCLE",
  27: "PROPERTY",
  28: "PROPERTY",
  29: "XNAME",
  30: "XNAME-REF",
  31: "XELEMENT",
  32: "XGEOMETRY",
  33: "CBLOCK"
};
function renderLayoutPreview(panel, data, ctx) {
  const section = createSection(`${data.format} \u7248\u56FE\u9884\u89C8`);
  const summary = document.createElement("div");
  summary.className = "ofv-cad-summary ofv-layout-summary";
  summary.hidden = data.shapes.length > 0 || data.labels.length > 0 || data.references.length > 0;
  if (summary.hidden) {
    summary.setAttribute("aria-hidden", "true");
    summary.style.display = "none";
  }
  appendMeta5(summary, "\u6587\u4EF6", data.fileName);
  appendMeta5(summary, "\u683C\u5F0F", data.format);
  if (data.libraryName) {
    appendMeta5(summary, "\u5E93", data.libraryName);
  }
  if (data.version) {
    appendMeta5(summary, "\u7248\u672C", data.version);
  }
  if (data.unit) {
    appendMeta5(summary, "\u5355\u4F4D", data.unit);
  }
  appendMeta5(summary, "Cell", data.cells.length);
  appendMeta5(summary, "\u51E0\u4F55", data.shapes.length);
  appendMeta5(summary, "\u5F15\u7528", data.references.length);
  appendMeta5(summary, "\u6587\u5B57", data.labels.length);
  for (const [label, value] of data.metadata) {
    appendMeta5(summary, label, value);
  }
  section.append(summary);
  for (const noteText of [...data.notes, ...data.warnings]) {
    const note = document.createElement("p");
    note.className = data.warnings.includes(noteText) ? "ofv-layout-warning" : "ofv-layout-note";
    note.textContent = noteText;
    if (!data.warnings.includes(noteText) && hasDrawableLayout(data)) {
      hideSupplementalInfo7(note);
    }
    section.append(note);
  }
  const bounds = computeLayoutBounds(data.shapes, data.labels, data.references);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "ofv-svg-stage ofv-layout-stage");
  let currentViewBox = { x: bounds.minX, y: bounds.minY, width: bounds.width, height: bounds.height };
  const initialViewBox = { ...currentViewBox };
  const applyViewBox = () => {
    svg.setAttribute("viewBox", `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.width} ${currentViewBox.height}`);
  };
  applyViewBox();
  if (data.shapes.length === 0) {
    const empty = document.createElementNS(svg.namespaceURI, "text");
    empty.setAttribute("x", String(bounds.minX + bounds.width * 0.5));
    empty.setAttribute("y", String(bounds.minY + bounds.height * 0.5));
    empty.setAttribute("text-anchor", "middle");
    empty.setAttribute("font-size", String(Math.max(bounds.width, bounds.height) / 34));
    empty.setAttribute("fill", "currentColor");
    empty.textContent = "\u5DF2\u8BC6\u522B\u7248\u56FE\u6587\u4EF6\uFF0C\u5F53\u524D\u6587\u4EF6\u672A\u89E3\u6790\u51FA\u53EF\u7ED8\u5236\u51E0\u4F55";
    svg.append(empty);
  }
  const layerIndex = new Map([...data.layers.keys()].sort((a, b) => a.localeCompare(b)).map((layer, index) => [layer, index]));
  for (const shape of data.shapes.slice(0, 6e3)) {
    const color = layoutPalette[(layerIndex.get(shape.layer) || 0) % layoutPalette.length];
    if (shape.kind === "path") {
      const polyline = document.createElementNS(svg.namespaceURI, "polyline");
      polyline.setAttribute("points", shape.points.map(([x, y]) => `${x},${-y}`).join(" "));
      polyline.setAttribute("fill", "none");
      polyline.setAttribute("stroke", color);
      polyline.setAttribute("stroke-width", String(Math.max(bounds.stroke, Math.abs(shape.width || 0))));
      polyline.setAttribute("stroke-linecap", "round");
      polyline.setAttribute("stroke-linejoin", "round");
      applyLayer(polyline, shape.layer);
      svg.append(polyline);
      continue;
    }
    const polygon = document.createElementNS(svg.namespaceURI, "polygon");
    polygon.setAttribute("points", shape.points.map(([x, y]) => `${x},${-y}`).join(" "));
    polygon.setAttribute("fill", color);
    polygon.setAttribute("fill-opacity", "0.18");
    polygon.setAttribute("stroke", color);
    polygon.setAttribute("stroke-width", String(bounds.stroke));
    polygon.setAttribute("vector-effect", "non-scaling-stroke");
    applyLayer(polygon, shape.layer);
    svg.append(polygon);
  }
  for (const label of data.labels.slice(0, 400)) {
    const text = document.createElementNS(svg.namespaceURI, "text");
    text.setAttribute("x", String(label.x));
    text.setAttribute("y", String(-label.y));
    text.setAttribute("font-size", String(Math.max(bounds.stroke * 12, Math.max(bounds.width, bounds.height) / 120)));
    text.setAttribute("fill", "currentColor");
    text.textContent = label.text;
    applyLayer(text, label.layer);
    svg.append(text);
  }
  const layers = [...data.layers.keys()].sort((a, b) => a.localeCompare(b));
  if (layers.length > 0) {
    const layerControls = createLayoutLayerControls(svg, layers, data.layers);
    if (hasDrawableLayout(data)) {
      hideSupplementalInfo7(layerControls);
    }
    section.append(layerControls);
  }
  section.append(svg);
  if (data.cells.length > 0) {
    section.append(createLayoutCellList(data.cells, data.references, hasDrawableLayout(data)));
  }
  panel.append(section);
  const updateToolbarZoom = () => ctx.toolbar?.setZoom(initialViewBox.width / currentViewBox.width);
  updateToolbarZoom();
  return {
    canCommand(command) {
      return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset";
    },
    command(command) {
      if (command === "zoom-in" || command === "zoom-out") {
        const factor = command === "zoom-in" ? 0.82 : 1.18;
        const centerX = currentViewBox.x + currentViewBox.width / 2;
        const centerY = currentViewBox.y + currentViewBox.height / 2;
        currentViewBox.width *= factor;
        currentViewBox.height *= factor;
        currentViewBox.x = centerX - currentViewBox.width / 2;
        currentViewBox.y = centerY - currentViewBox.height / 2;
        applyViewBox();
        updateToolbarZoom();
        return true;
      }
      if (command === "zoom-reset") {
        currentViewBox = { ...initialViewBox };
        applyViewBox();
        updateToolbarZoom();
        return true;
      }
      return false;
    },
    destroy() {
      ctx.toolbar?.setZoom(void 0);
    }
  };
}
function parseGdsLayout(bytes, fileName) {
  const shapes = [];
  const labels = [];
  const references = [];
  const cells = [];
  const layers = /* @__PURE__ */ new Map();
  const recordCounts = /* @__PURE__ */ new Map();
  const warnings = [];
  let libraryName = "";
  let version = "";
  let unit = "";
  let offset = 0;
  let current = {};
  let currentKind = "";
  let currentCell = "";
  while (offset + 4 <= bytes.length) {
    const length = readUInt16(bytes, offset);
    const recordType = bytes[offset + 2];
    const data = bytes.slice(offset + 4, offset + length);
    const name = gdsRecordNames[recordType] || `0x${recordType.toString(16).padStart(2, "0")}`;
    recordCounts.set(name, (recordCounts.get(name) || 0) + 1);
    if (length < 4 || offset + length > bytes.length) {
      warnings.push(`GDS \u8BB0\u5F55\u5728 ${offset} \u5B57\u8282\u5904\u957F\u5EA6\u5F02\u5E38\uFF0C\u5DF2\u505C\u6B62\u89E3\u6790\u3002`);
      break;
    }
    if (recordType === 0 && data.length >= 2) {
      version = String(readUInt16(data, 0));
    } else if (recordType === 2) {
      libraryName = readGdsString(data);
    } else if (recordType === 3 && data.length >= 16) {
      unit = `${formatGdsReal(data, 0)} / ${formatGdsReal(data, 8)}`;
    } else if (recordType === 6) {
      currentCell = readGdsString(data);
      cells.push(currentCell);
    } else if (recordType === 8 || recordType === 9 || recordType === 45) {
      currentKind = recordType === 9 ? "path" : recordType === 45 ? "box" : "boundary";
      current = { kind: currentKind, layer: "0", datatype: "0", points: [] };
    } else if (recordType === 12) {
      currentKind = "text";
      current = { layer: "0", text: "", x: 0, y: 0 };
    } else if (recordType === 10 || recordType === 11) {
      currentKind = "reference";
      current = { cell: "", x: 0, y: 0 };
    } else if (recordType === 13 && data.length >= 2) {
      current.layer = String(readInt16(data, 0));
    } else if ((recordType === 14 || recordType === 22) && data.length >= 2) {
      current.datatype = String(readInt16(data, 0));
    } else if (recordType === 15 && data.length >= 4) {
      current.width = Math.abs(readInt32(data, 0));
    } else if (recordType === 19 && data.length >= 4) {
      current.columns = Math.max(1, readInt16(data, 0));
      current.rows = Math.max(1, readInt16(data, 2));
    } else if (recordType === 16) {
      const points = readGdsPoints(data);
      if (currentKind === "text" && points[0]) {
        current.x = points[0][0];
        current.y = points[0][1];
      } else if (currentKind === "reference" && points[0]) {
        current.x = points[0][0];
        current.y = points[0][1];
        if (points.length >= 3) {
          const columns = Math.max(1, Number(current.columns || 1));
          const rows = Math.max(1, Number(current.rows || 1));
          current.columnDx = (points[1][0] - points[0][0]) / Math.max(1, columns - 1);
          current.columnDy = (points[1][1] - points[0][1]) / Math.max(1, columns - 1);
          current.rowDx = (points[2][0] - points[0][0]) / Math.max(1, rows - 1);
          current.rowDy = (points[2][1] - points[0][1]) / Math.max(1, rows - 1);
        }
      } else {
        current.points = points;
      }
    } else if (recordType === 18) {
      current.cell = readGdsString(data);
    } else if (recordType === 25) {
      current.text = readGdsString(data);
    } else if (recordType === 17) {
      if ((currentKind === "boundary" || currentKind === "path" || currentKind === "box") && current.points && current.points.length > 1) {
        const shape = {
          kind: current.kind || "boundary",
          cell: currentCell,
          layer: String(current.layer || "0"),
          datatype: current.datatype,
          points: current.points,
          width: current.width
        };
        shapes.push(shape);
        layers.set(shape.layer, (layers.get(shape.layer) || 0) + 1);
      } else if (currentKind === "text" && current.text) {
        const label = {
          cell: currentCell,
          layer: String(current.layer || "0"),
          text: String(current.text),
          x: Number(current.x || 0),
          y: Number(current.y || 0)
        };
        labels.push(label);
        layers.set(label.layer, (layers.get(label.layer) || 0) + 1);
      } else if (currentKind === "reference" && current.cell) {
        references.push({
          ownerCell: currentCell,
          cell: String(current.cell),
          x: Number(current.x || 0),
          y: Number(current.y || 0),
          columns: current.columns,
          rows: current.rows,
          columnDx: current.columnDx,
          columnDy: current.columnDy,
          rowDx: current.rowDx,
          rowDy: current.rowDy
        });
      }
      current = {};
      currentKind = "";
    }
    offset += length;
  }
  const expanded = expandLayoutReferences(shapes, labels, references, cells);
  return {
    format: "GDSII",
    fileName,
    libraryName,
    version: version ? `Stream ${version}` : void 0,
    unit,
    cells,
    shapes: expanded.shapes,
    labels: expanded.labels,
    references,
    layers: countLayoutLayers(expanded.shapes, expanded.labels),
    metadata: [
      ["\u5927\u5C0F", formatBytes3(bytes.byteLength)],
      ["\u8BB0\u5F55", sumCounts(recordCounts)],
      ["\u8BB0\u5F55\u7C7B\u578B", recordCounts.size],
      ["\u5C55\u5F00\u51E0\u4F55", expanded.addedShapes]
    ],
    notes: [
      `\u5DF2\u4ECE GDSII Stream \u4E2D\u89E3\u6790 ${shapes.length} \u4E2A\u539F\u59CB\u51E0\u4F55\u3001${references.length} \u4E2A cell \u5F15\u7528\u548C ${labels.length} \u6BB5\u6587\u5B57\uFF0C\u5E76\u5C55\u5F00 ${expanded.addedShapes} \u4E2A\u5F15\u7528\u51E0\u4F55\u3002`
    ],
    warnings
  };
}
function expandLayoutReferences(shapes, labels, references, cells) {
  if (references.length === 0 || shapes.length === 0) {
    return { shapes, labels, addedShapes: 0 };
  }
  const childCells = new Set(references.map((reference) => reference.cell));
  const topCells = cells.filter((cell) => !childCells.has(cell));
  const roots = topCells.length > 0 ? topCells : cells.slice(-1);
  const shapeKeys = new Set(shapes.map(layoutShapeKey));
  const labelKeys = new Set(labels.map(layoutLabelKey));
  const expandedShapes = [...shapes];
  const expandedLabels = [...labels];
  const maxDepth = 10;
  const maxAddedShapes = 1e4;
  let addedShapes = 0;
  const expandCell = (cell, offsetX, offsetY, depth, stack) => {
    if (depth > maxDepth || addedShapes >= maxAddedShapes || stack.has(cell)) {
      return;
    }
    const nextStack = new Set(stack);
    nextStack.add(cell);
    for (const shape of shapes) {
      if (shape.cell !== cell || offsetX === 0 && offsetY === 0) {
        continue;
      }
      const cloned = {
        ...shape,
        points: shape.points.map(([x, y]) => [x + offsetX, y + offsetY])
      };
      const key = layoutShapeKey(cloned);
      if (!shapeKeys.has(key)) {
        shapeKeys.add(key);
        expandedShapes.push(cloned);
        addedShapes += 1;
        if (addedShapes >= maxAddedShapes) {
          break;
        }
      }
    }
    for (const label of labels) {
      if (label.cell !== cell || offsetX === 0 && offsetY === 0) {
        continue;
      }
      const cloned = {
        ...label,
        x: label.x + offsetX,
        y: label.y + offsetY
      };
      const key = layoutLabelKey(cloned);
      if (!labelKeys.has(key)) {
        labelKeys.add(key);
        expandedLabels.push(cloned);
      }
    }
    for (const reference of references) {
      if (reference.ownerCell !== cell) {
        continue;
      }
      const columns = Math.max(1, Math.floor(reference.columns || 1));
      const rows = Math.max(1, Math.floor(reference.rows || 1));
      const columnDx = Number(reference.columnDx || 0);
      const columnDy = Number(reference.columnDy || 0);
      const rowDx = Number(reference.rowDx || 0);
      const rowDy = Number(reference.rowDy || 0);
      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          expandCell(
            reference.cell,
            offsetX + reference.x + column * columnDx + row * rowDx,
            offsetY + reference.y + column * columnDy + row * rowDy,
            depth + 1,
            nextStack
          );
        }
      }
    }
  };
  for (const root of roots) {
    expandCell(root, 0, 0, 0, /* @__PURE__ */ new Set());
  }
  return { shapes: expandedShapes, labels: expandedLabels, addedShapes };
}
function countLayoutLayers(shapes, labels) {
  const layers = /* @__PURE__ */ new Map();
  for (const shape of shapes) {
    layers.set(shape.layer, (layers.get(shape.layer) || 0) + 1);
  }
  for (const label of labels) {
    layers.set(label.layer, (layers.get(label.layer) || 0) + 1);
  }
  return layers;
}
function layoutShapeKey(shape) {
  return `${shape.kind}|${shape.cell || ""}|${shape.layer}|${shape.datatype || ""}|${shape.width || ""}|${shape.points.map(([x, y]) => `${x},${y}`).join(";")}`;
}
function layoutLabelKey(label) {
  return `${label.cell || ""}|${label.layer}|${label.text}|${label.x}|${label.y}`;
}
function parseOasisLayout(bytes, fileName) {
  const chunks = extractOasisCblocks(bytes);
  const expanded = chunks.flatMap((chunk) => [...chunk.bytes]);
  const cellNames = uniqueHints([...extractAsciiRuns(bytes), ...chunks.flatMap((chunk) => extractAsciiRuns(chunk.bytes))]).filter((item) => /^[A-Za-z_][\w$.-]{1,80}$/.test(item)).filter((item) => !item.startsWith("S_"));
  const propertyNames = uniqueHints(chunks.flatMap((chunk) => extractAsciiRuns(chunk.bytes)).filter((item) => item.startsWith("S_")));
  const recordCounts = scanOasisRecordCounts(bytes);
  const expandedCounts = scanOasisRecordCounts(new Uint8Array(expanded));
  const layers = /* @__PURE__ */ new Map();
  const shapes = [];
  const labels = [];
  const references = [];
  for (const name of cellNames) {
    references.push({ cell: name, x: 0, y: 0 });
  }
  const pseudo = createOasisStructureShapes(cellNames, chunks.length || recordCounts.size || 1);
  for (const shape of pseudo) {
    shapes.push(shape);
    layers.set(shape.layer, (layers.get(shape.layer) || 0) + 1);
  }
  for (let index = 0; index < cellNames.length; index++) {
    labels.push({ layer: "cell", text: cellNames[index], x: 12, y: -(18 + index * 18) });
  }
  if (cellNames.length > 0) {
    layers.set("cell", (layers.get("cell") || 0) + cellNames.length);
  }
  const version = readOasisVersion(bytes);
  const cblockText = chunks.length ? `${chunks.length} \u4E2A\uFF0C\u5C55\u5F00 ${formatBytes3(chunks.reduce((sum, chunk) => sum + chunk.bytes.byteLength, 0))}` : "\u672A\u53D1\u73B0";
  const notes = [
    "OASIS \u662F\u9AD8\u538B\u7F29\u82AF\u7247\u7248\u56FE\u683C\u5F0F\uFF0C\u5F53\u524D\u7248\u672C\u63D0\u4F9B\u6D4F\u89C8\u5668\u7AEF\u8BC6\u522B\u3001CBLOCK \u89E3\u538B\u3001cell/\u5C5E\u6027\u7ED3\u6784\u548C\u8F7B\u91CF\u7ED3\u6784\u793A\u610F\uFF1B\u5B8C\u6574\u51E0\u4F55\u9AD8\u4FDD\u771F\u6E32\u67D3\u5EFA\u8BAE\u540E\u7EED\u63A5\u5165\u4E13\u7528 OASIS \u89E3\u6790\u5668\u3002"
  ];
  if (propertyNames.length > 0) {
    notes.push(`\u8BC6\u522B\u5230\u5C5E\u6027\uFF1A${propertyNames.slice(0, 5).join("\u3001")}`);
  }
  return {
    format: "OASIS",
    fileName,
    version,
    cells: cellNames,
    shapes,
    labels,
    references: [],
    layers,
    metadata: [
      ["\u5927\u5C0F", formatBytes3(bytes.byteLength)],
      ["CBLOCK", cblockText],
      ["\u8BB0\u5F55\u7C7B\u578B", recordCounts.size + expandedCounts.size],
      ["\u53EF\u8BFB\u7247\u6BB5", cellNames.length + propertyNames.length]
    ],
    notes,
    warnings: cellNames.length === 0 ? ["\u5F53\u524D OASIS \u6587\u4EF6\u672A\u63D0\u53D6\u5230 cell \u540D\u79F0\uFF0C\u53EF\u80FD\u4F7F\u7528\u4E86\u66F4\u590D\u6742\u7684\u7D22\u5F15\u6216\u52A0\u5BC6/\u538B\u7F29\u5E03\u5C40\u3002"] : []
  };
}
function computeLayoutBounds(shapes, labels, references) {
  const xs = [];
  const ys = [];
  for (const shape of shapes) {
    for (const [x, y] of shape.points) {
      xs.push(x);
      ys.push(-y);
    }
  }
  for (const label of labels) {
    xs.push(label.x, label.x + label.text.length * 12);
    ys.push(-label.y, -label.y - 16);
  }
  for (const reference of references) {
    xs.push(reference.x);
    ys.push(-reference.y);
  }
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 100);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 100);
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const padding = Math.max(width, height) * 0.06;
  return {
    minX: minX - padding,
    minY: minY - padding,
    width: width + padding * 2,
    height: height + padding * 2,
    stroke: Math.max(width, height) / 900
  };
}
function createLayoutLayerControls(svg, layers, counts) {
  const controls = document.createElement("div");
  controls.className = "ofv-cad-layers ofv-layout-layers";
  const title = document.createElement("strong");
  title.textContent = `\u56FE\u5C42 ${layers.length}`;
  controls.append(title);
  for (const layer of layers) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.addEventListener("change", () => {
      for (const element of svg.querySelectorAll(`[data-layer="${escapeCssAttribute(layer)}"]`)) {
        element.style.display = checkbox.checked ? "" : "none";
      }
    });
    const name = document.createElement("span");
    name.textContent = `${layer} (${counts.get(layer) || 0})`;
    label.append(checkbox, name);
    controls.append(label);
  }
  return controls;
}
function createLayoutCellList(cells, references, hidden = false) {
  const details = document.createElement("details");
  details.className = "ofv-details ofv-layout-cells";
  details.open = !hidden;
  if (hidden) {
    hideSupplementalInfo7(details);
  }
  const summary = document.createElement("summary");
  summary.textContent = `Cell \u7ED3\u6784 ${cells.length}`;
  const list = document.createElement("ul");
  const refCounts = countBy(references.map((reference) => reference.cell));
  for (const cell of cells.slice(0, 120)) {
    const item = document.createElement("li");
    const count = refCounts.get(cell) || 0;
    item.textContent = count > 0 ? `${cell} \xB7 \u5F15\u7528 ${count}` : cell;
    list.append(item);
  }
  details.append(summary, list);
  return details;
}
function hasDrawableLayout(data) {
  return data.shapes.length > 0 || data.labels.length > 0 || data.references.length > 0;
}
function readUInt16(bytes, offset) {
  return bytes[offset] << 8 | bytes[offset + 1];
}
function readInt16(bytes, offset) {
  const value = readUInt16(bytes, offset);
  return value & 32768 ? value - 65536 : value;
}
function readInt32(bytes, offset) {
  const value = bytes[offset] << 24 | bytes[offset + 1] << 16 | bytes[offset + 2] << 8 | bytes[offset + 3];
  return value | 0;
}
function readGdsString(bytes) {
  return new TextDecoder("ascii").decode(bytes).replace(/\0+$/g, "").trim();
}
function readGdsPoints(bytes) {
  const points = [];
  for (let offset = 0; offset + 7 < bytes.length; offset += 8) {
    points.push([readInt32(bytes, offset), readInt32(bytes, offset + 4)]);
  }
  return points;
}
function formatGdsReal(bytes, offset) {
  const value = readGdsReal(bytes, offset);
  if (!Number.isFinite(value) || value === 0) {
    return "0";
  }
  if (Math.abs(value) < 1e-3 || Math.abs(value) >= 1e4) {
    return value.toExponential(4);
  }
  return String(Number(value.toPrecision(6)));
}
function readGdsReal(bytes, offset) {
  const first = bytes[offset];
  if (!first) {
    return 0;
  }
  const sign = first & 128 ? -1 : 1;
  const exponent = (first & 127) - 64;
  let mantissa = 0;
  for (let index = 1; index < 8; index++) {
    mantissa = mantissa * 256 + bytes[offset + index];
  }
  return sign * (mantissa / Math.pow(2, 56)) * Math.pow(16, exponent);
}
function sumCounts(counts) {
  return [...counts.values()].reduce((sum, count) => sum + count, 0);
}
function extractOasisCblocks(bytes) {
  const chunks = [];
  const seen = /* @__PURE__ */ new Set();
  const limit = Math.min(bytes.length, 25e4);
  for (let offset = 0; offset < limit; offset++) {
    try {
      const inflated = pako3.inflateRaw(bytes.slice(offset));
      if (inflated.byteLength < 4) {
        continue;
      }
      const ascii = extractAsciiRuns(inflated);
      const hasLayoutSignal = ascii.some((item) => item.startsWith("S_") || /TOP|CELL|DIE|SIZE/i.test(item));
      const hasRecordSignal = inflated.some((byte) => byte >= 13 && byte <= 34);
      if (!hasLayoutSignal && !hasRecordSignal) {
        continue;
      }
      const signature = `${inflated.byteLength}:${Array.from(inflated.slice(0, 12)).join(",")}`;
      if (seen.has(signature)) {
        continue;
      }
      seen.add(signature);
      chunks.push({ offset, bytes: inflated });
      if (chunks.length >= 12) {
        break;
      }
    } catch {
    }
  }
  return chunks;
}
function scanOasisRecordCounts(bytes) {
  const counts = /* @__PURE__ */ new Map();
  for (const byte of bytes.slice(0, Math.min(bytes.length, 12e3))) {
    const name = oasisRecordNames[byte];
    if (name) {
      counts.set(name, (counts.get(name) || 0) + 1);
    }
  }
  return counts;
}
function readOasisVersion(bytes) {
  const magic = "%SEMI-OASIS\r\n";
  const header = new TextDecoder("ascii").decode(bytes.slice(0, Math.min(bytes.length, 48)));
  if (!header.startsWith(magic)) {
    return void 0;
  }
  const start = magic.length;
  if (bytes[start] !== 1) {
    return "OASIS";
  }
  const length = bytes[start + 1];
  const version = new TextDecoder("ascii").decode(bytes.slice(start + 2, start + 2 + length));
  return version ? `OASIS ${version}` : "OASIS";
}
function createOasisStructureShapes(cellNames, fallbackCount) {
  const rows = Math.max(1, cellNames.length || fallbackCount);
  const shapes = [];
  for (let index = 0; index < rows; index++) {
    const top = -(index * 18);
    const height = 12;
    const width = 88 + Math.min((cellNames[index]?.length || 5) * 4, 90);
    shapes.push({
      kind: "box",
      layer: "cell",
      points: [
        [0, top],
        [width, top],
        [width, top - height],
        [0, top - height],
        [0, top]
      ]
    });
  }
  return shapes;
}
function renderBinaryCad(panel, bytes, extension, fileName) {
  const section = createSection(`${extension.toUpperCase()} \u6587\u4EF6\u9884\u89C8`);
  const note = document.createElement("p");
  note.textContent = extension === "dwg" ? "\u5DF2\u8BC6\u522B DWG \u4E13\u6709\u4E8C\u8FDB\u5236\u56FE\u7EB8\u3002\u6838\u5FC3\u63D2\u4EF6\u9ED8\u8BA4\u63D0\u4F9B\u7248\u672C\u3001\u5BB9\u5668\u3001\u7ED3\u6784\u7EBF\u7D22\u548C\u63A5\u5165\u5EFA\u8BAE\uFF1B\u771F\u5B9E\u51E0\u4F55\u6E32\u67D3\u53EF\u901A\u8FC7 cadPlugin({ binaryRenderer }) \u63A5\u5165\u53EF\u9009\u524D\u7AEF\u5F15\u64CE\u6216\u8F6C\u6362\u670D\u52A1\u3002" : "\u5DF2\u8BC6\u522B DWF \u53D1\u5E03\u56FE\u7EB8\u3002\u6838\u5FC3\u63D2\u4EF6\u9ED8\u8BA4\u63D0\u4F9B\u5BB9\u5668\u7EBF\u7D22\u548C\u63A5\u5165\u5EFA\u8BAE\uFF1B\u9AD8\u4FDD\u771F\u9875\u9762\u6E32\u67D3\u53EF\u901A\u8FC7 cadPlugin({ binaryRenderer }) \u63A5\u5165\u4E13\u7528\u89E3\u6790\u5668\u6216\u8F6C\u6362\u670D\u52A1\u3002";
  const meta = document.createElement("div");
  meta.className = "ofv-cad-summary";
  appendMeta5(meta, "\u6587\u4EF6", fileName);
  appendMeta5(meta, "\u683C\u5F0F", extension.toUpperCase());
  appendMeta5(meta, "\u5927\u5C0F", formatBytes3(bytes.byteLength));
  appendMeta5(meta, "\u7B7E\u540D", byteSignature2(bytes));
  appendMeta5(meta, "\u7248\u672C", detectCadVersion(bytes, extension));
  appendMeta5(meta, "\u5BB9\u5668", detectCadContainer(bytes));
  const actions = document.createElement("div");
  actions.className = "ofv-cad-conversion";
  const actionTitle = document.createElement("h4");
  actionTitle.textContent = extension === "dwg" ? "\u63A8\u8350\u589E\u5F3A\u8DEF\u7EBF" : "\u63A8\u8350\u5904\u7406\u8DEF\u7EBF";
  const actionList = document.createElement("ol");
  const suggestions = extension === "dwg" ? [
    "\u4EA7\u54C1\u9ED8\u8BA4\u94FE\u8DEF\uFF1A\u670D\u52A1\u7AEF\u5C06 DWG \u8F6C\u4E3A PDF/SVG/DXF\uFF0C\u518D\u590D\u7528\u73B0\u6709 PDF\u3001\u56FE\u50CF\u6216 DXF \u9884\u89C8\u3002",
    "\u7EAF\u524D\u7AEF\u589E\u5F3A\uFF1A\u901A\u8FC7 binaryRenderer \u63A5\u5165 mlightcad / LibreDWG WASM \u4E00\u7C7B\u5F15\u64CE\uFF0C\u6309\u9700\u52A0\u8F7D worker \u548C\u5B57\u4F53\u8D44\u6E90\u3002",
    "\u5546\u7528\u9AD8\u4FDD\u771F\uFF1A\u63A5\u5165 ODA Drawings SDK / Web SDK\uFF0C\u9002\u5408\u590D\u6742\u56FE\u5C42\u3001\u5B57\u4F53\u3001\u5916\u90E8\u53C2\u7167\u548C\u5927\u56FE\u7EB8\u3002"
  ] : [
    "\u4F18\u5148\u5728\u670D\u52A1\u7AEF\u8F6C\u6362\u4E3A PDF/SVG\uFF0C\u4FDD\u7559\u56FE\u5C42\u3001\u9875\u9762\u548C\u6807\u6CE8\u4FE1\u606F\u3002",
    "\u82E5 DWF \u4E3A\u538B\u7F29\u5BB9\u5668\uFF0C\u53EF\u901A\u8FC7 binaryRenderer \u8BFB\u53D6 manifest/descriptor \u518D\u8FD8\u539F\u9875\u9762\u8D44\u6E90\u3002",
    "\u82E5\u4E1A\u52A1\u53EA\u9700\u4E0B\u8F7D/\u5F52\u6863\uFF0C\u4FDD\u7559\u5F53\u524D\u6587\u4EF6\u5143\u4FE1\u606F\u548C\u8F6C\u6362\u63D0\u793A\u5373\u53EF\u3002"
  ];
  for (const suggestion of suggestions) {
    const item = document.createElement("li");
    item.textContent = suggestion;
    actionList.append(item);
  }
  actions.append(actionTitle, actionList);
  const raw = document.createElement("details");
  raw.className = "ofv-details ofv-cad-raw-preview";
  const rawSummary = document.createElement("summary");
  rawSummary.textContent = "\u539F\u59CB\u5B57\u8282\u9884\u89C8";
  const preview = document.createElement("pre");
  preview.className = "ofv-text-block";
  preview.textContent = hexPreview(bytes);
  raw.append(rawSummary, preview);
  section.append(note, meta, actions, createBinaryCadProbe(bytes, extension), raw);
  panel.append(section);
}
function createBinaryCadProbe(bytes, extension) {
  const probe = probeBinaryCad(bytes);
  const details = document.createElement("details");
  details.className = "ofv-details ofv-cad-binary-probe";
  const summary = document.createElement("summary");
  summary.textContent = "\u4E8C\u8FDB\u5236\u7ED3\u6784\u63A2\u6D4B";
  const meta = document.createElement("div");
  meta.className = "ofv-archive-probe-meta";
  appendMeta5(meta, "\u53EF\u8BFB\u7247\u6BB5", probe.tokens.length);
  appendMeta5(meta, "\u5B9E\u4F53\u5173\u952E\u8BCD", formatCadKeywordCounts(probe.entityCounts));
  appendMeta5(meta, "\u56FE\u5C42\u7EBF\u7D22", String(probe.layerHints.length));
  appendMeta5(meta, "\u5757/\u5F15\u7528\u7EBF\u7D22", String(probe.blockHints.length));
  appendMeta5(meta, "\u5916\u90E8\u5F15\u7528", String(probe.externalRefs.length));
  appendMeta5(meta, "\u89E3\u6790\u7EA7\u522B", extension === "dwg" ? "\u542F\u53D1\u5F0F\u626B\u63CF" : "\u5BB9\u5668/\u6587\u672C\u626B\u63CF");
  details.append(summary, meta);
  const hints = [...probe.layerHints, ...probe.blockHints, ...probe.externalRefs].slice(0, 18);
  if (hints.length > 0) {
    const list = document.createElement("ul");
    list.className = "ofv-cad-probe-list";
    for (const hint of hints) {
      const item = document.createElement("li");
      item.textContent = hint;
      list.append(item);
    }
    details.append(list);
  }
  if (probe.tokens.length > 0) {
    const preview = document.createElement("pre");
    preview.className = "ofv-text-block";
    preview.textContent = probe.tokens.slice(0, 80).join("\n");
    details.append(preview);
  }
  return details;
}
function probeBinaryCad(bytes) {
  const text = extractAsciiRuns(bytes.slice(0, Math.min(bytes.length, 65536)));
  const tokens = text.map((item) => item.trim()).filter((item) => item.length >= 3).slice(0, 240);
  const entityKeywords = ["LINE", "CIRCLE", "ARC", "LWPOLYLINE", "POLYLINE", "TEXT", "MTEXT", "INSERT", "BLOCK", "LAYER", "XREF", "DIMENSION"];
  const entityCounts = /* @__PURE__ */ new Map();
  for (const token of tokens) {
    const normalized = token.toUpperCase();
    for (const keyword of entityKeywords) {
      if (normalized.includes(keyword)) {
        entityCounts.set(keyword, (entityCounts.get(keyword) || 0) + 1);
      }
    }
  }
  return {
    tokens,
    entityCounts,
    layerHints: uniqueHints(tokens.filter((item) => /layer|图层/i.test(item))),
    blockHints: uniqueHints(tokens.filter((item) => /block|insert|块/i.test(item))),
    externalRefs: uniqueHints(tokens.filter((item) => /xref|\.dwg|\.dxf|\.pdf|\.png|\.jpe?g/i.test(item)))
  };
}
function extractAsciiRuns(bytes) {
  const result = [];
  let current = "";
  for (const byte of bytes) {
    if (byte >= 32 && byte <= 126) {
      current += String.fromCharCode(byte);
      continue;
    }
    if (current.length >= 3) {
      result.push(current);
    }
    current = "";
  }
  if (current.length >= 3) {
    result.push(current);
  }
  return result;
}
function uniqueHints(values) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).slice(0, 12);
}
function formatCadKeywordCounts(counts) {
  const text = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([type, count]) => `${type} ${count}`).join(", ");
  return text || "\u672A\u53D1\u73B0";
}
function parseStepRecords(text) {
  return [...text.matchAll(/#(\d+)\s*=\s*([A-Z0-9_]+)\s*\(([\s\S]*?)\)\s*;/gi)].map((match) => ({
    id: `#${match[1]}`,
    type: (match[2] || "").toUpperCase(),
    args: (match[3] || "").replace(/\s+/g, " ").trim()
  }));
}
function parseIgesRecords(text) {
  const parameterText = text.split(/\r?\n/).filter((line) => line.slice(72, 73).toUpperCase() === "P" || /^\s*\d+\s*,/.test(line)).map((line) => line.slice(0, 72).trim()).join("");
  if (!parameterText) {
    return [];
  }
  return parameterText.split(";").map((record) => record.trim()).filter(Boolean).map((record) => {
    const params = record.split(",").map((part) => part.trim()).filter(Boolean);
    return { type: params[0] || "UNKNOWN", params };
  });
}
function parseAcisSatRecords(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("End-of-ACIS-data")).filter((line) => /[A-Za-z]/.test(line)).map((line, index) => {
    const cleaned = line.replace(/#$/, "").trim();
    const idMatch = cleaned.match(/^(-?\d+)\s+/);
    const id = idMatch ? `#${idMatch[1]}` : `#${index + 1}`;
    const body = idMatch ? cleaned.slice(idMatch[0].length).trim() : cleaned;
    const tokens = body.split(/\s+/);
    const type = normalizeTextCadType(tokens.find((token) => /[A-Za-z]/.test(token)) || tokens[0] || "record");
    return {
      id,
      type,
      args: body,
      numbers: extractNumbers(body)
    };
  }).filter((record) => record.args && record.type !== "record");
}
function parseParasolidTextRecords(text) {
  return text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !/^(BEGIN|END|HEADER|SCH|T51|P_SCHEMA)/i.test(line)).map((line, index) => {
    const cleaned = line.replace(/[;{}]+$/g, "").trim();
    const idMatch = cleaned.match(/^#?(\d+)\s*[=:]\s*/);
    const id = idMatch ? `#${idMatch[1]}` : `#${index + 1}`;
    const body = idMatch ? cleaned.slice(idMatch[0].length).trim() : cleaned;
    const typeMatch = body.match(/^([A-Za-z_][\w.-]*)\s*[\[(]/) || body.match(/\b(type|entity|class)\s*[=:]\s*['"]?([A-Za-z_][\w.-]*)/i);
    const type = normalizeTextCadType(typeMatch?.[2] || typeMatch?.[1] || body.split(/\s+/)[0] || "record");
    return {
      id,
      type,
      args: body,
      numbers: extractNumbers(body)
    };
  }).filter((record) => record.args && record.type !== "record");
}
function summarizeStepRecord(record) {
  if (record.type === "CARTESIAN_POINT") {
    const point = record.args.match(/\(([-+0-9., E]+)\)/i)?.[1];
    return point ? `\u5750\u6807 ${point.replace(/\s+/g, "")}` : record.args;
  }
  if (record.type === "DIRECTION" || record.type === "VECTOR") {
    const direction = record.args.match(/\(([-+0-9., E]+)\)/i)?.[1];
    return direction ? `\u5411\u91CF ${direction.replace(/\s+/g, "")}` : record.args;
  }
  if (record.type === "LINE" || record.type === "CIRCLE" || record.type === "ADVANCED_FACE") {
    return record.args.slice(0, 180);
  }
  return record.args.slice(0, 120);
}
function summarizeAcisRecord(record) {
  const coords = extractLikelyPoint(record.numbers);
  if (coords) {
    return `\u5750\u6807 ${coords.map(formatNumber).join(", ")}`;
  }
  return record.args.slice(0, 160);
}
function summarizeParasolidRecord(record) {
  const coords = extractLikelyPoint(record.numbers);
  if (coords) {
    return `\u5750\u6807 ${coords.map(formatNumber).join(", ")}`;
  }
  return record.args.slice(0, 160);
}
function extractStepGeometry(records) {
  const pointsById = /* @__PURE__ */ new Map();
  const directionsById = /* @__PURE__ */ new Map();
  const points = [];
  const lines = [];
  for (const record of records) {
    if (record.type === "CARTESIAN_POINT") {
      const coords = parseStepTuple(record.args);
      if (coords.length >= 2) {
        const point = [coords[0], coords[1], coords[2] || 0];
        pointsById.set(record.id, point);
        points.push({ x: point[0], y: point[1], label: record.id });
      }
    } else if (record.type === "DIRECTION" || record.type === "VECTOR") {
      const coords = parseStepTuple(record.args);
      if (coords.length >= 2) {
        directionsById.set(record.id, [coords[0], coords[1], coords[2] || 0]);
      }
    }
  }
  for (const record of records) {
    if (record.type !== "LINE" && record.type !== "EDGE_CURVE") {
      continue;
    }
    const refs = [...record.args.matchAll(/#\d+/g)].map((match) => match[0]);
    const firstPoint = refs.map((ref) => pointsById.get(ref)).find(Boolean);
    if (!firstPoint) {
      continue;
    }
    const secondPoint = refs.slice(1).map((ref) => pointsById.get(ref)).find((point) => point && point !== firstPoint);
    if (secondPoint) {
      lines.push({ x1: firstPoint[0], y1: firstPoint[1], x2: secondPoint[0], y2: secondPoint[1], label: record.id });
      continue;
    }
    const direction = refs.map((ref) => directionsById.get(ref)).find(Boolean);
    if (direction) {
      const length = Math.max(10, estimateGeometrySpan(pointsById) * 0.25);
      lines.push({
        x1: firstPoint[0],
        y1: firstPoint[1],
        x2: firstPoint[0] + direction[0] * length,
        y2: firstPoint[1] + direction[1] * length,
        label: record.id
      });
    }
  }
  return { points, lines };
}
function extractIgesGeometry(records) {
  const points = [];
  const lines = [];
  for (const [index, record] of records.entries()) {
    if (record.type === "116") {
      const coords = record.params.slice(1).map(Number);
      if (coords.length >= 2 && coords.every((value) => Number.isFinite(value))) {
        points.push({ x: coords[0], y: coords[1], label: String(index + 1) });
      }
    }
    if (record.type === "110") {
      const coords = record.params.slice(1).map(Number);
      if (coords.length >= 6 && coords.every((value) => Number.isFinite(value))) {
        lines.push({ x1: coords[0], y1: coords[1], x2: coords[3], y2: coords[4], label: String(index + 1) });
      }
    }
  }
  return { points, lines };
}
function extractAcisSatGeometry(records) {
  const points = collectTextCadPoints(records, /vertex|point|coedge|edge|straight-curve|ellipse|spline|surface/);
  const lines = [];
  for (const record of records) {
    if (!/straight-curve|line|edge/i.test(record.type)) {
      continue;
    }
    const vectors = chunkVectors(record.numbers);
    if (vectors.length >= 2) {
      const [start, direction] = vectors;
      const length = Math.max(10, estimatePointSpan(points) * 0.25);
      lines.push({
        x1: start[0],
        y1: start[1],
        x2: start[0] + direction[0] * length,
        y2: start[1] + direction[1] * length,
        label: record.id
      });
    }
  }
  return { points: dedupeGeometryPoints(points), lines };
}
function extractParasolidTextGeometry(records) {
  const points = collectTextCadPoints(records, /point|vertex|line|curve|edge/);
  const lines = [];
  for (const record of records) {
    if (!/line|edge|curve/i.test(record.type)) {
      continue;
    }
    const vectors = chunkVectors(record.numbers);
    if (vectors.length >= 2) {
      lines.push({
        x1: vectors[0][0],
        y1: vectors[0][1],
        x2: vectors[1][0],
        y2: vectors[1][1],
        label: record.id
      });
    }
  }
  return { points: dedupeGeometryPoints(points), lines };
}
function collectTextCadPoints(records, typePattern) {
  const points = [];
  for (const record of records) {
    if (!typePattern.test(record.type)) {
      continue;
    }
    const point = extractLikelyPoint(record.numbers);
    if (point) {
      points.push({ x: point[0], y: point[1], label: record.id });
    }
  }
  return points;
}
function createCadGeometryPreview(geometry, titleText) {
  if (geometry.points.length === 0 && geometry.lines.length === 0) {
    return null;
  }
  const wrapper = document.createElement("figure");
  wrapper.className = "ofv-cad-geometry-preview";
  const caption = document.createElement("figcaption");
  caption.textContent = `${titleText} \xB7 \u70B9 ${geometry.points.length} \xB7 \u7EBF ${geometry.lines.length}`;
  hideSupplementalInfo7(caption);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "ofv-svg-stage ofv-cad-geometry-stage");
  const bounds = computeCadGeometryBounds(geometry);
  svg.setAttribute("viewBox", `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`);
  for (const lineData of geometry.lines.slice(0, 2e3)) {
    const line = document.createElementNS(svg.namespaceURI, "line");
    line.setAttribute("x1", String(lineData.x1));
    line.setAttribute("y1", String(-lineData.y1));
    line.setAttribute("x2", String(lineData.x2));
    line.setAttribute("y2", String(-lineData.y2));
    line.setAttribute("stroke", "#2563eb");
    line.setAttribute("stroke-width", String(bounds.stroke));
    line.setAttribute("vector-effect", "non-scaling-stroke");
    svg.append(line);
  }
  for (const point of geometry.points.slice(0, 2e3)) {
    const circle = document.createElementNS(svg.namespaceURI, "circle");
    circle.setAttribute("cx", String(point.x));
    circle.setAttribute("cy", String(-point.y));
    circle.setAttribute("r", String(bounds.pointRadius));
    circle.setAttribute("fill", "#dc2626");
    circle.setAttribute("vector-effect", "non-scaling-stroke");
    svg.append(circle);
  }
  wrapper.append(caption, svg);
  return { element: wrapper, svg, bounds };
}
function createGeometryViewer(svg, bounds, ctx) {
  const initialViewBox = { x: bounds.minX, y: bounds.minY, width: bounds.width, height: bounds.height };
  let currentViewBox = { ...initialViewBox };
  const applyViewBox = () => {
    svg.setAttribute("viewBox", `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.width} ${currentViewBox.height}`);
  };
  const updateToolbarZoom = () => ctx.toolbar?.setZoom(initialViewBox.width / currentViewBox.width);
  applyViewBox();
  updateToolbarZoom();
  return {
    canCommand(command) {
      return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset";
    },
    command(command) {
      if (command === "zoom-in" || command === "zoom-out") {
        const factor = command === "zoom-in" ? 0.82 : 1.18;
        const centerX = currentViewBox.x + currentViewBox.width / 2;
        const centerY = currentViewBox.y + currentViewBox.height / 2;
        currentViewBox.width *= factor;
        currentViewBox.height *= factor;
        currentViewBox.x = centerX - currentViewBox.width / 2;
        currentViewBox.y = centerY - currentViewBox.height / 2;
        applyViewBox();
        updateToolbarZoom();
        return true;
      }
      if (command === "zoom-reset") {
        currentViewBox = { ...initialViewBox };
        applyViewBox();
        updateToolbarZoom();
        return true;
      }
      return false;
    },
    destroy() {
      ctx.toolbar?.setZoom(void 0);
    }
  };
}
function parseStepTuple(args) {
  const tuple = args.match(/\(([-+0-9., E]+)\)/i)?.[1] || "";
  return tuple.split(",").map((part) => Number(part.trim())).filter((value) => Number.isFinite(value));
}
function extractNumbers(text) {
  return [...text.matchAll(/[-+]?(?:\d+\.\d*|\.\d+|\d+)(?:[eE][-+]?\d+)?/g)].map((match) => Number(match[0])).filter((value) => Number.isFinite(value));
}
function extractLikelyPoint(numbers) {
  if (numbers.length < 3) {
    return null;
  }
  const candidates = chunkVectors(numbers);
  const candidate = candidates.find((vector) => vector.some((value) => Math.abs(value) > 1e-9) && vector.every((value) => Math.abs(value) < 1e12)) || candidates[0];
  return candidate || null;
}
function chunkVectors(numbers) {
  const vectors = [];
  for (let index = 0; index + 2 < numbers.length; index += 3) {
    vectors.push([numbers[index], numbers[index + 1], numbers[index + 2]]);
  }
  return vectors;
}
function dedupeGeometryPoints(points) {
  const seen = /* @__PURE__ */ new Set();
  return points.filter((point) => {
    const key = `${point.x.toFixed(6)},${point.y.toFixed(6)}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}
function estimatePointSpan(points) {
  if (points.length < 2) {
    return 40;
  }
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return Math.max(40, Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
}
function normalizeTextCadType(value) {
  return value.replace(/^@+/, "").replace(/[^A-Za-z0-9_.-]/g, "").toLowerCase();
}
function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : Number(value.toPrecision(6)).toString();
}
function estimateGeometrySpan(points) {
  const values = [...points.values()];
  if (values.length < 2) {
    return 40;
  }
  const xs = values.map((point) => point[0]);
  const ys = values.map((point) => point[1]);
  return Math.max(40, Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
}
function computeCadGeometryBounds(geometry) {
  const xs = [];
  const ys = [];
  for (const point of geometry.points) {
    xs.push(point.x);
    ys.push(-point.y);
  }
  for (const line of geometry.lines) {
    xs.push(line.x1, line.x2);
    ys.push(-line.y1, -line.y2);
  }
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 100);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 100);
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const padding = Math.max(width, height) * 0.08;
  return {
    minX: minX - padding,
    minY: minY - padding,
    width: width + padding * 2,
    height: height + padding * 2,
    stroke: Math.max(width, height) / 500,
    pointRadius: Math.max(width, height) / 90
  };
}
function summarizeIfcRecord(record) {
  const strings = extractStepStrings(record.args);
  const globalId = strings[0];
  const name = strings[2] || strings[1];
  const label = [globalId, name].filter(Boolean).join(" \xB7 ");
  if (label) {
    return label;
  }
  return summarizeStepRecord(record);
}
function createIfcHierarchy(records) {
  const rows = records.filter((record) => ["IFCPROJECT", "IFCSITE", "IFCBUILDING", "IFCBUILDINGSTOREY", "IFCSPACE"].includes(record.type)).slice(0, 80).map((record) => ({
    id: record.id,
    type: ifcTypeName(record.type),
    detail: summarizeIfcRecord(record)
  }));
  if (rows.length === 0) {
    return null;
  }
  const wrapper = document.createElement("div");
  wrapper.className = "ofv-table-scroll ofv-cad-entities";
  const title = document.createElement("strong");
  title.textContent = "BIM \u5C42\u7EA7";
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const header = document.createElement("tr");
  for (const label of ["ID", "\u5C42\u7EA7", "\u540D\u79F0"]) {
    const cell = document.createElement("th");
    cell.textContent = label;
    header.append(cell);
  }
  thead.append(header);
  const tbody = document.createElement("tbody");
  for (const row of rows) {
    const tr = document.createElement("tr");
    for (const value of [row.id, row.type, row.detail]) {
      const cell = document.createElement("td");
      cell.textContent = value;
      tr.append(cell);
    }
    tbody.append(tr);
  }
  table.append(thead, tbody);
  wrapper.append(title, table);
  return wrapper;
}
function extractStepStrings(args) {
  const values = [];
  const pattern = /'((?:''|[^'])*)'/g;
  let match;
  while (match = pattern.exec(args)) {
    values.push((match[1] || "").replace(/''/g, "'"));
  }
  return values;
}
function countIfcElements(counts) {
  const elementTypes = [
    "IFCBEAM",
    "IFCBUILDINGELEMENTPROXY",
    "IFCCOLUMN",
    "IFCCOVERING",
    "IFCCURTAINWALL",
    "IFCDOOR",
    "IFCFLOWSEGMENT",
    "IFCFURNISHINGELEMENT",
    "IFCMEMBER",
    "IFCPLATE",
    "IFCRAILING",
    "IFCRAMP",
    "IFCRAMPFLIGHT",
    "IFCROOF",
    "IFCSLAB",
    "IFCSTAIR",
    "IFCSTAIRFLIGHT",
    "IFCWALL",
    "IFCWALLSTANDARDCASE",
    "IFCWINDOW"
  ];
  return elementTypes.reduce((sum, type) => sum + (counts.get(type) || 0), 0);
}
function ifcTypeName(type) {
  const names = {
    IFCPROJECT: "\u9879\u76EE",
    IFCSITE: "\u573A\u5730",
    IFCBUILDING: "\u5EFA\u7B51",
    IFCBUILDINGSTOREY: "\u697C\u5C42",
    IFCSPACE: "\u7A7A\u95F4"
  };
  return names[type] || type;
}
function igesTypeName(type) {
  const names = {
    "100": "100 Circular Arc",
    "110": "110 Line",
    "112": "112 Parametric Spline Curve",
    "114": "114 Parametric Spline Surface",
    "116": "116 Point",
    "118": "118 Ruled Surface",
    "120": "120 Surface of Revolution",
    "126": "126 Rational B-Spline Curve",
    "128": "128 Rational B-Spline Surface",
    "144": "144 Trimmed Surface"
  };
  return names[type] || type;
}
function createUnsupportedCadSection(extension, fileName) {
  const section = createSection("CAD \u589E\u5F3A\u63A5\u5165\u63D0\u793A");
  const meta = document.createElement("div");
  meta.className = "ofv-cad-summary";
  appendMeta5(meta, "\u6587\u4EF6", fileName);
  appendMeta5(meta, "\u683C\u5F0F", `.${extension || "cad"}`);
  appendMeta5(meta, "\u5185\u7F6E\u80FD\u529B", unsupportedCadBuiltInLevel(extension));
  const note = document.createElement("p");
  note.textContent = unsupportedCadGuidance(extension);
  const actions = document.createElement("div");
  actions.className = "ofv-cad-conversion";
  const title = document.createElement("h4");
  title.textContent = "\u63A8\u8350\u589E\u5F3A\u8DEF\u7EBF";
  const list = document.createElement("ol");
  for (const suggestion of unsupportedCadSuggestions(extension)) {
    const item = document.createElement("li");
    item.textContent = suggestion;
    list.append(item);
  }
  actions.append(title, list);
  section.append(meta, note, actions);
  return section;
}
function unsupportedCadBuiltInLevel(extension) {
  if (extension === "sab" || extension === "x_b") {
    return "\u4E8C\u8FDB\u5236\u5185\u6838\u6587\u4EF6\u8BC6\u522B";
  }
  if (extension === "3dm" || extension === "skp" || extension === "sldprt" || extension === "sldasm") {
    return "\u4E13\u6709\u6A21\u578B\u683C\u5F0F\u8BC6\u522B";
  }
  return "\u683C\u5F0F\u8BC6\u522B";
}
function unsupportedCadGuidance(extension) {
  if (extension === "sab") {
    return "SAB \u662F ACIS \u4E8C\u8FDB\u5236\u5B9E\u4F53\u683C\u5F0F\uFF0C\u6D4F\u89C8\u5668\u7AEF\u6CA1\u6709\u7A33\u5B9A\u516C\u5F00\u89E3\u6790\u8DEF\u5F84\uFF1B\u82E5\u9700\u8981\u771F\u5B9E\u9884\u89C8\uFF0C\u5EFA\u8BAE\u5148\u8F6C\u6362\u4E3A SAT/STEP/GLB\uFF0C\u518D\u590D\u7528\u5F53\u524D\u8F7B\u91CF\u51E0\u4F55\u6216 3D \u9884\u89C8\u3002";
  }
  if (extension === "x_b") {
    return "x_b \u662F Parasolid \u4E8C\u8FDB\u5236\u683C\u5F0F\uFF0C\u5B8C\u6574 B-Rep \u9700\u8981\u4E13\u4E1A\u5185\u6838\uFF1B\u5EFA\u8BAE\u8F6C\u6362\u4E3A x_t/STEP/GLB\uFF0C\u6216\u901A\u8FC7 binaryRenderer \u63A5\u5165\u540E\u7AEF\u8F6C\u6362\u7ED3\u679C\u3002";
  }
  if (extension === "3dm") {
    return "3DM \u53EF\u901A\u8FC7 rhino3dm/rhino3dm.wasm \u505A\u524D\u7AEF\u589E\u5F3A\uFF1B\u6838\u5FC3\u5305\u6682\u4E0D\u5F3A\u7ED1\u8BE5\u5927\u578B\u4F9D\u8D56\uFF0C\u907F\u514D\u57FA\u7840\u5305\u4F53\u79EF\u660E\u663E\u81A8\u80C0\u3002";
  }
  if (extension === "skp") {
    return "SKP \u662F SketchUp \u4E13\u6709\u6A21\u578B\u683C\u5F0F\uFF0C\u7EAF\u524D\u7AEF\u9AD8\u4FDD\u771F\u89E3\u6790\u751F\u6001\u6709\u9650\uFF1B\u63A8\u8350\u8F6C\u6362\u4E3A glTF/GLB \u540E\u4F7F\u7528\u5185\u7F6E 3D \u9884\u89C8\u3002";
  }
  if (extension === "sldprt" || extension === "sldasm") {
    return "SolidWorks \u96F6\u4EF6/\u88C5\u914D\u5C5E\u4E8E\u5F3A\u4E13\u6709\u683C\u5F0F\uFF0C\u6D4F\u89C8\u5668\u5185\u65E0\u6CD5\u53EF\u9760\u89E3\u51FA\u51E0\u4F55\uFF1B\u63A8\u8350\u4F7F\u7528\u670D\u52A1\u7AEF\u8F6C\u6362\u4E3A STEP/GLB/PDF \u540E\u9884\u89C8\u3002";
  }
  return `.${extension || "cad"} \u5DF2\u8BC6\u522B\u4E3A\u56FE\u7EB8/\u5DE5\u7A0B\u683C\u5F0F\uFF1B\u5F53\u524D\u672A\u53D1\u73B0\u9002\u5408\u5185\u7F6E\u5230\u6838\u5FC3\u5305\u7684\u7A33\u5B9A\u7EAF\u524D\u7AEF\u9AD8\u4FDD\u771F\u89E3\u6790\u65B9\u6848\u3002`;
}
function unsupportedCadSuggestions(extension) {
  if (extension === "3dm") {
    return [
      "\u901A\u8FC7 cadPlugin({ binaryRenderer }) \u6309\u9700\u52A0\u8F7D rhino3dm.wasm\uFF0C\u5C06 mesh/curve \u8F6C\u4E3A Three.js \u6216 SVG\u3002",
      "\u670D\u52A1\u7AEF\u8F6C\u6362\u4E3A GLB/STEP/PDF\uFF0C\u518D\u590D\u7528\u5185\u7F6E 3D\u3001STEP \u6216 PDF \u9884\u89C8\u3002",
      "\u82E5\u53EA\u662F\u5F52\u6863\u548C\u4E0B\u8F7D\uFF0C\u53EF\u4FDD\u7559\u5F53\u524D\u683C\u5F0F\u8BC6\u522B\u548C\u589E\u5F3A\u63D0\u793A\u3002"
    ];
  }
  if (extension === "sab" || extension === "x_b") {
    return [
      "\u4F18\u5148\u8F6C\u6362\u4E3A\u6587\u672C SAT/x_t \u6216\u901A\u7528 STEP\uFF0C\u518D\u4F7F\u7528\u5185\u7F6E\u8F7B\u91CF\u7ED3\u6784\u9884\u89C8\u3002",
      "\u9AD8\u4FDD\u771F B-Rep \u53EF\u5728\u540E\u7AEF\u63A5\u5165 ACIS/Parasolid/HOOPS/ODA \u7B49\u5546\u4E1A\u5185\u6838\u540E\u8F93\u51FA PNG/PDF/SVG/GLB\u3002",
      "\u901A\u8FC7 binaryRenderer \u63A5\u5165\u4E1A\u52A1\u81EA\u5DF1\u7684\u8F6C\u6362\u670D\u52A1\uFF0C\u6838\u5FC3\u5305\u7EE7\u7EED\u4FDD\u6301\u8F7B\u91CF\u3002"
    ];
  }
  return [
    "\u670D\u52A1\u7AEF\u8F6C\u6362\u4E3A PDF/SVG/PNG/GLB/STEP \u7B49\u6D4F\u89C8\u5668\u53CB\u597D\u683C\u5F0F\u3002",
    "\u901A\u8FC7 cadPlugin({ binaryRenderer }) \u63A5\u5165 CADViewer\u3001MxCAD\u3001\u79C1\u6709\u8F6C\u6362\u670D\u52A1\u6216\u81EA\u7814 WASM \u5F15\u64CE\u3002",
    "\u4FDD\u6301\u6838\u5FC3\u5305\u5185\u7F6E\u80FD\u529B\u8F7B\u91CF\uFF0C\u907F\u514D\u628A\u5927\u578B\u4E13\u6709\u683C\u5F0F\u89E3\u6790\u5668\u5F3A\u5236\u6253\u8FDB\u9ED8\u8BA4\u5305\u3002"
  ];
}
function createCadTypeList(counts, titleText = "\u7C7B\u578B\u7EDF\u8BA1") {
  const details = document.createElement("details");
  details.className = "ofv-details ofv-cad-types";
  details.open = true;
  const summary = document.createElement("summary");
  summary.textContent = titleText;
  const list = document.createElement("ul");
  for (const [type, count] of [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 80)) {
    const item = document.createElement("li");
    item.textContent = `${type}: ${count}`;
    list.append(item);
  }
  details.append(summary, list);
  return details;
}
function createCadEntityTable(rows) {
  const wrapper = document.createElement("div");
  wrapper.className = "ofv-table-scroll ofv-cad-entities";
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const header = document.createElement("tr");
  for (const label of ["ID", "\u7C7B\u578B", "\u6458\u8981"]) {
    const cell = document.createElement("th");
    cell.textContent = label;
    header.append(cell);
  }
  thead.append(header);
  const tbody = document.createElement("tbody");
  for (const row of rows) {
    const tr = document.createElement("tr");
    for (const value of [row.id, row.type, row.detail]) {
      const cell = document.createElement("td");
      cell.textContent = value;
      tr.append(cell);
    }
    tbody.append(tr);
  }
  table.append(thead, tbody);
  wrapper.append(table);
  return wrapper;
}
function countBy(values) {
  const counts = /* @__PURE__ */ new Map();
  for (const value of values) {
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return counts;
}
function appendMeta5(parent, label, value) {
  const row = document.createElement("div");
  row.className = "ofv-meta-row";
  const key = document.createElement("span");
  key.textContent = label;
  const content = document.createElement("strong");
  content.textContent = String(value);
  row.append(key, content);
  parent.append(row);
}
function formatBytes3(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
function byteSignature2(bytes) {
  if (bytes.length === 0) {
    return "\u7A7A\u6587\u4EF6";
  }
  const ascii = new TextDecoder("ascii").decode(bytes.slice(0, Math.min(bytes.length, 16))).replace(/[^\x20-\x7E]/g, ".");
  const hex = Array.from(bytes.slice(0, Math.min(bytes.length, 8))).map((byte) => byte.toString(16).padStart(2, "0").toUpperCase()).join(" ");
  return `${ascii} (${hex})`;
}
function detectCadVersion(bytes, extension) {
  const header = new TextDecoder("ascii").decode(bytes.slice(0, Math.min(bytes.length, 32)));
  if (extension === "dwg") {
    const match = header.match(/AC\d{4}/);
    if (!match) {
      return "\u672A\u77E5 DWG \u7248\u672C";
    }
    const names = {
      AC1009: "AutoCAD R12",
      AC1012: "AutoCAD R13",
      AC1014: "AutoCAD R14",
      AC1015: "AutoCAD 2000/2002",
      AC1018: "AutoCAD 2004/2005/2006",
      AC1021: "AutoCAD 2007/2008/2009",
      AC1024: "AutoCAD 2010/2011/2012",
      AC1027: "AutoCAD 2013/2014/2015/2016/2017",
      AC1032: "AutoCAD 2018+"
    };
    return `${match[0]}${names[match[0]] ? ` \xB7 ${names[match[0]]}` : ""}`;
  }
  if (header.startsWith("(DWF") || header.includes("DWF")) {
    return header.split(/\s+/)[0] || "DWF";
  }
  return "\u672A\u77E5\u7248\u672C";
}
function detectCadContainer(bytes) {
  if (bytes[0] === 80 && bytes[1] === 75) {
    return "ZIP/PK \u538B\u7F29\u5BB9\u5668";
  }
  if (bytes[0] === 31 && bytes[1] === 139) {
    return "GZIP \u538B\u7F29\u6D41";
  }
  if (bytes[0] === 40 && bytes[1] === 68 && bytes[2] === 87 && bytes[3] === 70) {
    return "DWF ASCII \u5934";
  }
  return "\u4E8C\u8FDB\u5236\u6D41";
}
function hexPreview(bytes) {
  const rows = [];
  const limit = Math.min(bytes.length, 256);
  for (let offset = 0; offset < limit; offset += 16) {
    const slice = bytes.slice(offset, offset + 16);
    const hex = Array.from(slice).map((byte) => byte.toString(16).padStart(2, "0").toUpperCase()).join(" ").padEnd(47, " ");
    const ascii = Array.from(slice).map((byte) => byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ".").join("");
    rows.push(`${offset.toString(16).padStart(8, "0").toUpperCase()}  ${hex}  ${ascii}`);
  }
  if (bytes.length > limit) {
    rows.push(`... \u4EC5\u5C55\u793A\u524D ${limit} \u5B57\u8282\uFF0C\u5171 ${bytes.length} \u5B57\u8282`);
  }
  return rows.join("\n") || "\u65E0\u53EF\u5C55\u793A\u5B57\u8282\u3002";
}
function renderDxf(panel, dxf, ctx) {
  const pairs = dxf.split(/\r?\n/).map((line) => line.trim());
  const lines = [];
  const circles = [];
  const arcs = [];
  const points = [];
  const polylines = [];
  const texts = [];
  for (let index = 0; index < pairs.length; index += 2) {
    const code = pairs[index];
    const value = pairs[index + 1];
    if (code === "0" && value === "LINE") {
      const entity = readEntity(pairs, index + 2);
      lines.push({
        layer: normalizeLayerName(entity["8"]),
        value: [
          Number(entity["10"] || 0),
          Number(entity["20"] || 0),
          Number(entity["11"] || 0),
          Number(entity["21"] || 0)
        ]
      });
    }
    if (code === "0" && value === "CIRCLE") {
      const entity = readEntity(pairs, index + 2);
      circles.push({
        layer: normalizeLayerName(entity["8"]),
        value: [
          Number(entity["10"] || 0),
          Number(entity["20"] || 0),
          Number(entity["40"] || 0)
        ]
      });
    }
    if (code === "0" && value === "ARC") {
      const entity = readEntity(pairs, index + 2);
      arcs.push({
        layer: normalizeLayerName(entity["8"]),
        value: [
          Number(entity["10"] || 0),
          Number(entity["20"] || 0),
          Number(entity["40"] || 0),
          Number(entity["50"] || 0),
          Number(entity["51"] || 0)
        ]
      });
    }
    if (code === "0" && value === "POINT") {
      const entity = readEntity(pairs, index + 2);
      points.push({
        layer: normalizeLayerName(entity["8"]),
        value: [Number(entity["10"] || 0), Number(entity["20"] || 0)]
      });
    }
    if (code === "0" && value === "LWPOLYLINE") {
      const entity = readEntity(pairs, index + 2);
      const entityPairs = readEntityPairs(pairs, index + 2);
      const polyline = readPolylinePoints(entityPairs);
      if (polyline.length > 1) {
        polylines.push({ layer: normalizeLayerName(entity["8"]), value: polyline });
      }
    }
    if (code === "0" && value === "POLYLINE") {
      const result = readLegacyPolyline(pairs, index + 2);
      if (result.points.length > 1) {
        polylines.push({ layer: result.layer, value: result.points });
      }
      index = Math.max(index, result.endIndex - 2);
    }
    if (code === "0" && (value === "TEXT" || value === "MTEXT")) {
      const entity = readEntity(pairs, index + 2);
      const text = normalizeDxfText(entity["1"] || entity["3"] || "");
      if (text) {
        texts.push({
          layer: normalizeLayerName(entity["8"]),
          value: [
            Number(entity["10"] || 0),
            Number(entity["20"] || 0),
            text,
            Math.max(1, Number(entity["40"] || 12))
          ]
        });
      }
    }
  }
  const section = createSection(`DXF \u57FA\u7840\u9884\u89C8`);
  hideSupplementalInfo7(section.querySelector("h3"));
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "ofv-svg-stage");
  const bounds = computeBounds(lines, circles, arcs, points, polylines, texts);
  const initialViewBox = {
    x: bounds.minX,
    y: bounds.minY,
    width: bounds.width,
    height: bounds.height
  };
  let currentViewBox = { ...initialViewBox };
  const applyViewBox = () => {
    svg.setAttribute(
      "viewBox",
      `${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.width} ${currentViewBox.height}`
    );
  };
  applyViewBox();
  for (const item of lines.slice(0, 3e3)) {
    const [x1, y1, x2, y2] = item.value;
    const line = document.createElementNS(svg.namespaceURI, "line");
    line.setAttribute("x1", String(x1));
    line.setAttribute("y1", String(-y1));
    line.setAttribute("x2", String(x2));
    line.setAttribute("y2", String(-y2));
    line.setAttribute("stroke", "#111827");
    line.setAttribute("stroke-width", String(bounds.stroke));
    applyLayer(line, item.layer);
    svg.append(line);
  }
  for (const item of circles.slice(0, 1e3)) {
    const [cx, cy, radius] = item.value;
    const circle = document.createElementNS(svg.namespaceURI, "circle");
    circle.setAttribute("cx", String(cx));
    circle.setAttribute("cy", String(-cy));
    circle.setAttribute("r", String(Math.abs(radius)));
    circle.setAttribute("fill", "none");
    circle.setAttribute("stroke", "#2563eb");
    circle.setAttribute("stroke-width", String(bounds.stroke));
    applyLayer(circle, item.layer);
    svg.append(circle);
  }
  for (const item of arcs.slice(0, 1e3)) {
    const [cx, cy, radius, startAngle, endAngle] = item.value;
    const path = document.createElementNS(svg.namespaceURI, "path");
    path.setAttribute("d", arcPath(cx, -cy, Math.abs(radius), -startAngle, -endAngle));
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#7c3aed");
    path.setAttribute("stroke-width", String(bounds.stroke));
    applyLayer(path, item.layer);
    svg.append(path);
  }
  for (const item of polylines.slice(0, 2e3)) {
    const polyline = item.value;
    const path = document.createElementNS(svg.namespaceURI, "polyline");
    path.setAttribute("points", polyline.map(([x, y]) => `${x},${-y}`).join(" "));
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#0f766e");
    path.setAttribute("stroke-width", String(bounds.stroke));
    applyLayer(path, item.layer);
    svg.append(path);
  }
  for (const item of points.slice(0, 3e3)) {
    const [x, y] = item.value;
    const point = document.createElementNS(svg.namespaceURI, "circle");
    point.setAttribute("cx", String(x));
    point.setAttribute("cy", String(-y));
    point.setAttribute("r", String(bounds.stroke * 2));
    point.setAttribute("fill", "#dc2626");
    applyLayer(point, item.layer);
    svg.append(point);
  }
  for (const item of texts.slice(0, 500)) {
    const [x, y, text, height] = item.value;
    const label = document.createElementNS(svg.namespaceURI, "text");
    label.setAttribute("x", String(x));
    label.setAttribute("y", String(-y));
    label.setAttribute("font-size", String(Math.max(height, bounds.stroke * 8)));
    label.setAttribute("fill", "currentColor");
    label.textContent = text;
    applyLayer(label, item.layer);
    svg.append(label);
  }
  const layers = Array.from(
    new Set([...lines, ...circles, ...arcs, ...points, ...polylines, ...texts].map((item) => item.layer))
  ).sort((a, b) => a.localeCompare(b));
  if (layers.length > 1) {
    const layerControls = createLayerControls(svg, layers);
    hideSupplementalInfo7(layerControls);
    section.append(layerControls);
  }
  const note = document.createElement("p");
  note.textContent = `\u5DF2\u63D0\u53D6 LINE ${lines.length} \u4E2A\u3001CIRCLE ${circles.length} \u4E2A\u3001ARC ${arcs.length} \u4E2A\u3001POLYLINE ${polylines.length} \u4E2A\u3001POINT ${points.length} \u4E2A\u3001TEXT ${texts.length} \u4E2A\u3002`;
  hideSupplementalInfo7(note);
  section.append(note, svg);
  panel.append(section);
  const updateToolbarZoom = () => {
    ctx.toolbar?.setZoom(initialViewBox.width / currentViewBox.width);
  };
  updateToolbarZoom();
  return {
    canCommand(command) {
      return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset";
    },
    command(command) {
      if (command === "zoom-in" || command === "zoom-out") {
        const factor = command === "zoom-in" ? 0.82 : 1.18;
        const centerX = currentViewBox.x + currentViewBox.width / 2;
        const centerY = currentViewBox.y + currentViewBox.height / 2;
        currentViewBox.width *= factor;
        currentViewBox.height *= factor;
        currentViewBox.x = centerX - currentViewBox.width / 2;
        currentViewBox.y = centerY - currentViewBox.height / 2;
        applyViewBox();
        updateToolbarZoom();
        return true;
      }
      if (command === "zoom-reset") {
        currentViewBox = { ...initialViewBox };
        applyViewBox();
        updateToolbarZoom();
        return true;
      }
      return false;
    },
    destroy() {
      ctx.toolbar?.setZoom(void 0);
    }
  };
}
function applyLayer(element, layer) {
  element.setAttribute("data-layer", layer);
}
function createLayerControls(svg, layers) {
  const controls = document.createElement("div");
  controls.className = "ofv-cad-layers";
  const title = document.createElement("strong");
  title.textContent = `\u56FE\u5C42 ${layers.length}`;
  controls.append(title);
  for (const layer of layers) {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.addEventListener("change", () => {
      for (const element of svg.querySelectorAll(`[data-layer="${escapeCssAttribute(layer)}"]`)) {
        element.style.display = checkbox.checked ? "" : "none";
      }
    });
    const name = document.createElement("span");
    name.textContent = layer;
    label.append(checkbox, name);
    controls.append(label);
  }
  return controls;
}
function readEntity(pairs, start) {
  const entity = {};
  for (let index = start; index < pairs.length; index += 2) {
    const code = pairs[index];
    const value = pairs[index + 1];
    if (code === "0") {
      break;
    }
    entity[code] = value;
  }
  return entity;
}
function readEntityPairs(pairs, start) {
  const entityPairs = [];
  for (let index = start; index < pairs.length; index += 2) {
    const code = pairs[index];
    const value = pairs[index + 1];
    if (code === "0") {
      break;
    }
    entityPairs.push([code, value]);
  }
  return entityPairs;
}
function readPolylinePoints(entityPairs) {
  const points = [];
  let x;
  for (const [code, value] of entityPairs) {
    if (code === "10") {
      x = Number(value);
    }
    if (code === "20" && x !== void 0) {
      points.push([x, Number(value)]);
      x = void 0;
    }
  }
  return points;
}
function readLegacyPolyline(pairs, start) {
  let layer = "0";
  const points = [];
  for (let index = start; index < pairs.length; index += 2) {
    const code = pairs[index];
    const value = pairs[index + 1];
    if (code === "0" && value === "SEQEND") {
      return { layer, points, endIndex: index + 2 };
    }
    if (code === "8") {
      layer = normalizeLayerName(value);
    }
    if (code === "0" && value === "VERTEX") {
      const entity = readEntity(pairs, index + 2);
      points.push([Number(entity["10"] || 0), Number(entity["20"] || 0)]);
    }
  }
  return { layer, points, endIndex: pairs.length };
}
function normalizeLayerName(layer) {
  return layer?.trim() || "0";
}
function escapeCssAttribute(value) {
  if (typeof CSS !== "undefined" && CSS.escape) {
    return CSS.escape(value);
  }
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}
function normalizeDxfText(text) {
  return text.replace(/\\P/g, "\n").replace(/\\[A-Za-z][^;{}\\]*;/g, "").replace(/\\[A-Za-z]/g, "").replace(/\{\\[^;]+;/g, "").replace(/[{}]/g, "").trim();
}
function arcPath(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const delta = Math.abs(endAngle - startAngle);
  const largeArc = delta <= 180 ? "0" : "1";
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}
function polarToCartesian(cx, cy, radius, angleDegrees) {
  const angle = angleDegrees * Math.PI / 180;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle)
  };
}
function hideSupplementalInfo7(element) {
  element.hidden = true;
  element.setAttribute("aria-hidden", "true");
  element.style.display = "none";
}
function hideSuccessfulSectionHeading3(section) {
  const heading = section.querySelector("h3");
  if (heading) {
    hideSupplementalInfo7(heading);
  }
}
function computeBounds(lines, circles, arcs, points, polylines, texts) {
  const xs = lines.flatMap(({ value: [x1, , x2] }) => [x1, x2]);
  const ys = lines.flatMap(({ value: [, y1, , y2] }) => [-y1, -y2]);
  for (const { value: [cx, cy, radius] } of circles) {
    xs.push(cx - radius, cx + radius);
    ys.push(-cy - radius, -cy + radius);
  }
  for (const { value: [cx, cy, radius] } of arcs) {
    xs.push(cx - radius, cx + radius);
    ys.push(-cy - radius, -cy + radius);
  }
  for (const { value: [x, y] } of points) {
    xs.push(x);
    ys.push(-y);
  }
  for (const { value: polyline } of polylines) {
    for (const [x, y] of polyline) {
      xs.push(x);
      ys.push(-y);
    }
  }
  for (const { value: [x, y, text, height2] } of texts) {
    xs.push(x, x + text.length * height2 * 0.6);
    ys.push(-y, -y - height2);
  }
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 100);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 100);
  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  return {
    minX,
    minY,
    width,
    height,
    stroke: Math.max(width, height) / 600
  };
}

// src/plugins/model3d.ts
var modelExtensions = /* @__PURE__ */ new Set([
  "gltf",
  "glb",
  "obj",
  "stl",
  "fbx",
  "dae",
  "ply",
  "3mf",
  "3ds",
  "usd",
  "usda",
  "usdc",
  "usdz",
  "wrl",
  "vrml"
]);
var modelMimeTypes = /* @__PURE__ */ new Set([
  "model/gltf+json",
  "model/gltf-binary",
  "model/stl",
  "model/obj",
  "model/vnd.collada+xml",
  "model/3mf",
  "model/3ds",
  "model/vnd.usd",
  "model/vnd.usdz+zip",
  "model/vrml",
  "application/sla",
  "application/vnd.ms-pki.stl",
  "application/ply",
  "application/vnd.autodesk.fbx"
]);
var modelMimeFormatMap = {
  "model/gltf+json": "gltf",
  "model/gltf-binary": "glb",
  "model/stl": "stl",
  "model/obj": "obj",
  "model/vnd.collada+xml": "dae",
  "model/3mf": "3mf",
  "model/3ds": "3ds",
  "model/vnd.usd": "usd",
  "model/vnd.usdz+zip": "usdz",
  "model/vrml": "wrl",
  "application/sla": "stl",
  "application/vnd.ms-pki.stl": "stl",
  "application/ply": "ply",
  "application/vnd.autodesk.fbx": "fbx"
};
var textLikeExtensions = /* @__PURE__ */ new Set(["json", "txt", "md", "xml", "yaml", "yml", "csv", "tsv", "js", "ts", "tsx", "jsx", "html", "css"]);
function model3dPlugin() {
  return {
    name: "model3d",
    match(file) {
      return modelExtensions.has(file.extension) || modelMimeTypes.has(file.mimeType) && (file.extension === "" || file.extension === "bin" || !textLikeExtensions.has(file.extension));
    },
    async render(ctx) {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
      const url = createObjectUrl(ctx.file);
      const isExternal = Boolean(ctx.file.url);
      const stage = document.createElement("div");
      stage.className = "ofv-model-stage";
      ctx.viewport.append(stage);
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(15987958);
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1e4);
      camera.position.set(2.5, 2, 3.5);
      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true });
      } catch {
        stage.remove();
        return renderModelFallback(ctx, url, isExternal, "\u5F53\u524D\u6D4F\u89C8\u5668\u6216\u8BBE\u5907\u4E0D\u652F\u6301 WebGL\uFF0C\u65E0\u6CD5\u76F4\u63A5\u6E32\u67D3 3D \u6A21\u578B\u3002");
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;
      stage.append(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      scene.add(new THREE.HemisphereLight(16777215, 9741240, 2.8));
      const directional = new THREE.DirectionalLight(16777215, 2);
      directional.position.set(4, 6, 5);
      scene.add(directional);
      scene.add(new THREE.GridHelper(10, 10, 13358561, 15067115));
      const extension = resolveFormat(ctx.file, modelMimeFormatMap);
      const modelUrl = resolveModelUrl(extension, url, ctx.file.url);
      const loaded = await loadModel(extension, modelUrl, THREE).catch(() => void 0);
      if (!loaded) {
        controls.dispose();
        renderer.dispose();
        stage.remove();
        return renderModelFallback(ctx, url, isExternal, "\u65E0\u6CD5\u89E3\u6790\u5F53\u524D 3D \u6A21\u578B\u5185\u5BB9\u3002");
      }
      if (loaded.message) {
        const message = document.createElement("div");
        message.className = "ofv-model-message";
        message.textContent = loaded.message;
        stage.append(message);
      }
      const object = loaded.object;
      const initialRotation = {
        x: object.rotation?.x ?? 0,
        y: object.rotation?.y ?? 0,
        z: object.rotation?.z ?? 0
      };
      scene.add(object);
      const initialFrame = frameObject(object, camera, controls, THREE);
      const measurement = measureObject(object, THREE);
      stage.append(createMeasurementPanel(measurement));
      stage.append(createMaterialPanel(collectMaterialStats(object)));
      let animationFrame = 0;
      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        animationFrame = window.requestAnimationFrame(animate);
      };
      animate();
      const resize = (size) => {
        const width = Math.max(1, size.width);
        const height = Math.max(1, size.height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      resize(ctx.size);
      const updateToolbarZoom = () => {
        const currentDistance = vectorDistance(camera.position, controls.target);
        const initialDistance = vectorDistance(initialFrame.cameraPosition, initialFrame.target);
        ctx.toolbar?.setZoom(initialDistance > 0 ? initialDistance / currentDistance : void 0);
      };
      updateToolbarZoom();
      return {
        canCommand(command) {
          return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset" || command === "rotate-right" || command === "rotate-left";
        },
        command(command) {
          if (command === "zoom-in" || command === "zoom-out") {
            const factor = command === "zoom-in" ? 0.82 : 1.18;
            camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target);
            camera.updateProjectionMatrix();
            controls.update();
            updateToolbarZoom();
            return true;
          }
          if (command === "zoom-reset") {
            camera.position.copy(initialFrame.cameraPosition);
            controls.target.copy(initialFrame.target);
            if (object.rotation) {
              object.rotation.set?.(initialRotation.x, initialRotation.y, initialRotation.z);
              object.rotation.x = initialRotation.x;
              object.rotation.y = initialRotation.y;
              object.rotation.z = initialRotation.z;
            }
            camera.near = initialFrame.near;
            camera.far = initialFrame.far;
            camera.updateProjectionMatrix();
            controls.update();
            updateToolbarZoom();
            return true;
          }
          if (command === "rotate-right" || command === "rotate-left") {
            object.rotateY(command === "rotate-right" ? Math.PI / 8 : -Math.PI / 8);
            return true;
          }
          return false;
        },
        resize,
        destroy() {
          ctx.toolbar?.setZoom(void 0);
          window.cancelAnimationFrame(animationFrame);
          controls.dispose();
          renderer.dispose();
          disposeObject(object, THREE);
          stage.remove();
          revokeObjectUrl(url, isExternal);
        }
      };
    }
  };
}
function vectorDistance(a, b) {
  if (typeof a.distanceTo === "function") {
    return a.distanceTo(b);
  }
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}
function renderModelFallback(ctx, url, isExternal, message) {
  const panel = document.createElement("div");
  panel.className = "ofv-fallback";
  const title = document.createElement("strong");
  title.textContent = "3D \u9884\u89C8\u4E0D\u53EF\u7528";
  const detail = document.createElement("span");
  detail.textContent = `${message} ${ctx.file.name}`;
  const download = document.createElement("a");
  download.href = url;
  download.download = ctx.file.name;
  download.textContent = "\u4E0B\u8F7D\u6587\u4EF6";
  panel.append(title, detail, download);
  ctx.viewport.classList.add("ofv-center");
  ctx.viewport.append(panel);
  return {
    canCommand() {
      return false;
    },
    destroy() {
      ctx.viewport.classList.remove("ofv-center");
      panel.remove();
      revokeObjectUrl(url, isExternal);
    }
  };
}
function resolveModelUrl(extension, objectUrl, sourceUrl) {
  if (extension === "gltf" && sourceUrl) {
    return sourceUrl;
  }
  return objectUrl;
}
async function loadModel(extension, url, THREE) {
  if (extension === "gltf" || extension === "glb") {
    const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
    const gltf = await new GLTFLoader().loadAsync(url);
    return { object: gltf.scene };
  }
  if (extension === "obj") {
    const { OBJLoader } = await import("three/examples/jsm/loaders/OBJLoader.js");
    return { object: await new OBJLoader().loadAsync(url) };
  }
  if (extension === "fbx") {
    const { FBXLoader } = await import("three/examples/jsm/loaders/FBXLoader.js");
    return { object: await new FBXLoader().loadAsync(url) };
  }
  if (extension === "dae") {
    const { ColladaLoader } = await import("three/examples/jsm/loaders/ColladaLoader.js");
    const collada = await new ColladaLoader().loadAsync(url);
    if (!collada) {
      throw new Error("Collada loader returned no scene.");
    }
    return { object: collada.scene };
  }
  if (extension === "stl") {
    const { STLLoader } = await import("three/examples/jsm/loaders/STLLoader.js");
    const geometry2 = await new STLLoader().loadAsync(url);
    const material2 = new THREE.MeshStandardMaterial({ color: 6583435, roughness: 0.55 });
    return { object: new THREE.Mesh(geometry2, material2) };
  }
  if (extension === "ply") {
    const { PLYLoader } = await import("three/examples/jsm/loaders/PLYLoader.js");
    const geometry2 = await new PLYLoader().loadAsync(url);
    const material2 = new THREE.MeshStandardMaterial({ color: 6583435, roughness: 0.55 });
    return { object: new THREE.Mesh(geometry2, material2) };
  }
  if (extension === "3mf") {
    const { ThreeMFLoader } = await import("three/examples/jsm/loaders/3MFLoader.js");
    return { object: await new ThreeMFLoader().loadAsync(url) };
  }
  if (extension === "3ds") {
    const { TDSLoader } = await import("three/examples/jsm/loaders/TDSLoader.js");
    return { object: await new TDSLoader().loadAsync(url) };
  }
  if (extension === "usd" || extension === "usda" || extension === "usdc" || extension === "usdz") {
    const { USDLoader } = await import("three/examples/jsm/loaders/USDLoader.js");
    return { object: await new USDLoader().loadAsync(url) };
  }
  if (extension === "wrl" || extension === "vrml") {
    const { VRMLLoader } = await import("three/examples/jsm/loaders/VRMLLoader.js");
    return { object: await new VRMLLoader().loadAsync(url) };
  }
  const group = new THREE.Group();
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 6583435 });
  const mesh = new THREE.Mesh(geometry, material);
  group.add(mesh);
  return {
    object: group,
    message: `.${extension} \u5DF2\u8BC6\u522B\u4E3A 3D \u683C\u5F0F\uFF0C\u5F53\u524D\u5185\u7F6E\u6E32\u67D3\u4F18\u5148\u652F\u6301 gltf/glb/obj/stl/fbx/dae/ply/3mf/3ds/usd/usdz/vrml\u3002`
  };
}
function frameObject(object, camera, controls, THREE) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z, 1);
  const distance = maxSize * 2.4;
  camera.position.set(center.x + distance, center.y + distance * 0.7, center.z + distance);
  camera.near = Math.max(distance / 1e3, 0.01);
  camera.far = distance * 1e3;
  camera.updateProjectionMatrix();
  controls.target.copy(center);
  controls.update();
  return {
    cameraPosition: camera.position.clone(),
    target: controls.target.clone(),
    near: camera.near,
    far: camera.far
  };
}
function measureObject(object, THREE) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  return {
    width: size.x,
    height: size.y,
    depth: size.z,
    diagonal: Math.sqrt(size.x ** 2 + size.y ** 2 + size.z ** 2),
    center: { x: center.x, y: center.y, z: center.z }
  };
}
function createMeasurementPanel(measurement) {
  const panel = document.createElement("div");
  panel.className = "ofv-model-measure";
  panel.hidden = true;
  panel.setAttribute("aria-hidden", "true");
  panel.style.display = "none";
  const title = document.createElement("strong");
  title.textContent = "\u6A21\u578B\u6D4B\u91CF";
  const list = document.createElement("dl");
  appendMeasure(list, "\u5BBD", measurement.width);
  appendMeasure(list, "\u9AD8", measurement.height);
  appendMeasure(list, "\u6DF1", measurement.depth);
  appendMeasure(list, "\u5BF9\u89D2\u7EBF", measurement.diagonal);
  appendMeasure(
    list,
    "\u4E2D\u5FC3",
    `${formatMeasure(measurement.center.x)}, ${formatMeasure(measurement.center.y)}, ${formatMeasure(measurement.center.z)}`
  );
  panel.append(title, list);
  return panel;
}
function appendMeasure(list, label, value) {
  const term = document.createElement("dt");
  term.textContent = label;
  const detail = document.createElement("dd");
  detail.textContent = typeof value === "number" ? formatMeasure(value) : value;
  list.append(term, detail);
}
function formatMeasure(value) {
  if (!Number.isFinite(value)) {
    return "-";
  }
  const rounded = Math.abs(value) >= 100 ? value.toFixed(1) : value.toFixed(3);
  return rounded.replace(/\.?0+$/, "");
}
function collectMaterialStats(object) {
  const materials = /* @__PURE__ */ new Set();
  const textures = /* @__PURE__ */ new Set();
  const slots = /* @__PURE__ */ new Set();
  const names = /* @__PURE__ */ new Set();
  let meshes = 0;
  object.traverse((child) => {
    const mesh = child;
    if (!mesh.geometry || !mesh.material) {
      return;
    }
    meshes += 1;
    for (const material of normalizeMaterials(mesh.material)) {
      materials.add(material);
      if (material.name) {
        names.add(material.name);
      }
      for (const slot of textureSlots) {
        const texture = material[slot];
        if (texture) {
          textures.add(texture);
          slots.add(slot);
        }
      }
    }
  });
  return {
    meshes,
    materials: materials.size,
    textures: textures.size,
    slots: [...slots],
    names: [...names].slice(0, 6)
  };
}
function createMaterialPanel(stats) {
  const panel = document.createElement("div");
  panel.className = "ofv-model-materials";
  panel.hidden = true;
  panel.setAttribute("aria-hidden", "true");
  panel.style.display = "none";
  const title = document.createElement("strong");
  title.textContent = "\u6750\u8D28\u8D34\u56FE";
  const list = document.createElement("dl");
  appendMaterialStat(list, "\u7F51\u683C", stats.meshes);
  appendMaterialStat(list, "\u6750\u8D28", stats.materials);
  appendMaterialStat(list, "\u8D34\u56FE", stats.textures);
  appendMaterialStat(list, "\u69FD\u4F4D", stats.slots.length > 0 ? stats.slots.join(", ") : "-");
  if (stats.names.length > 0) {
    appendMaterialStat(list, "\u540D\u79F0", stats.names.join(", "));
  }
  panel.append(title, list);
  return panel;
}
function appendMaterialStat(list, label, value) {
  const term = document.createElement("dt");
  term.textContent = label;
  const detail = document.createElement("dd");
  detail.textContent = String(value);
  list.append(term, detail);
}
function disposeObject(object, THREE) {
  object.traverse((child) => {
    const mesh = child;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    const material = mesh.material;
    for (const item of normalizeMaterials(material)) {
      disposeMaterialTextures(item);
      item.dispose();
    }
  });
}
var textureSlots = [
  "map",
  "aoMap",
  "alphaMap",
  "bumpMap",
  "displacementMap",
  "emissiveMap",
  "envMap",
  "lightMap",
  "metalnessMap",
  "normalMap",
  "roughnessMap"
];
function normalizeMaterials(material) {
  if (!material) {
    return [];
  }
  return Array.isArray(material) ? material : [material];
}
function disposeMaterialTextures(material) {
  for (const slot of textureSlots) {
    const texture = material[slot];
    texture?.dispose?.();
  }
}

// src/plugins/gis.ts
var gisExtensions = /* @__PURE__ */ new Set(["geojson", "topojson", "kml", "kmz", "gpx", "shp"]);
var gisMimeFormatMap = {
  "application/geo+json": "geojson",
  "application/vnd.geo+json": "geojson",
  "application/topo+json": "topojson",
  "application/vnd.google-earth.kml+xml": "kml",
  "application/vnd.google-earth.kmz": "kmz",
  "application/gpx+xml": "gpx"
};
function loadLeafletCss() {
  const id = "ofv-leaflet-css";
  if (document.getElementById(id)) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const link = document.createElement("link");
    let settled = false;
    const done = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };
    link.id = id;
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css";
    link.onload = done;
    link.onerror = done;
    document.head.appendChild(link);
    window.setTimeout(done, 0);
  });
}
function gisPlugin() {
  return {
    name: "gis",
    match(file) {
      return gisExtensions.has(resolveGisFormat(file)) || Boolean(gisMimeFormatMap[file.mimeType]);
    },
    async render(ctx) {
      await loadLeafletCss();
      const [L, topojson, toGeoJSON, shpjs, JSZip6] = await Promise.all([
        import("leaflet"),
        import("topojson-client"),
        import("@mapbox/togeojson"),
        import("shpjs"),
        import("jszip")
      ]);
      const Leaflet = L.default || L;
      const topojsonClient = topojson.default || topojson;
      const togeojsonLib = toGeoJSON.default || toGeoJSON;
      const shpLib = shpjs.default || shpjs;
      const JSZipLib = JSZip6.default || JSZip6;
      const DefaultIcon = Leaflet.icon({
        iconUrl: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
            <path fill="#3b82f6" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        `),
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
            <ellipse cx="12" cy="20" rx="6" ry="2" fill="#000000" opacity="0.2"/>
          </svg>
        `),
        shadowSize: [41, 41],
        shadowAnchor: [12, 41]
      });
      Leaflet.Marker.prototype.options.icon = DefaultIcon;
      const buffer = await readArrayBuffer(ctx.file);
      const geojson = await parseToGeoJson(
        ctx.file,
        buffer,
        togeojsonLib,
        topojsonClient,
        shpLib,
        JSZipLib
      ).catch((error) => {
        const fallback = createGisFallback("GIS \u6570\u636E\u89E3\u6790\u5931\u8D25", normalizeGisError(error, ctx.file.name));
        ctx.viewport.classList.add("ofv-center");
        ctx.viewport.append(fallback);
        return { fallback };
      });
      if (isGisFallback(geojson)) {
        return {
          destroy() {
            ctx.viewport.classList.remove("ofv-center");
            geojson.fallback.remove();
          }
        };
      }
      const wrapper = document.createElement("div");
      wrapper.className = "ofv-gis-viewer";
      const summary = summarizeGeoJson(geojson);
      wrapper.append(createGisSummary(summary));
      ctx.viewport.appendChild(wrapper);
      const mapContainer = document.createElement("div");
      mapContainer.className = "ofv-map-stage";
      wrapper.appendChild(mapContainer);
      if (summary.features === 0) {
        mapContainer.append(createEmptyMapState());
      }
      const map = Leaflet.map(mapContainer).setView([0, 0], 2);
      let toolbarZoom = 1;
      const updateToolbarZoom = () => {
        ctx.toolbar?.setZoom(toolbarZoom);
      };
      updateToolbarZoom();
      Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      const geojsonLayer = Leaflet.geoJSON(geojson, {
        style: () => ({
          className: "ofv-map-feature",
          color: "#e11d48",
          weight: 2,
          opacity: 0.92,
          fillColor: "#fb923c",
          fillOpacity: 0.3,
          lineCap: "round",
          lineJoin: "round"
        }),
        pointToLayer: (feature, latlng) => {
          return Leaflet.circleMarker(latlng, {
            className: "ofv-map-feature ofv-map-point",
            radius: 7,
            fillColor: "#e11d48",
            color: "#ffffff",
            weight: 2.5,
            opacity: 1,
            fillOpacity: 0.9
          });
        },
        onEachFeature: (feature, layer) => {
          const label = feature.properties?.name || feature.properties?.title || feature.properties?.label;
          if (label) {
            layer.bindTooltip?.(String(label), {
              className: "ofv-map-tooltip",
              direction: "top",
              sticky: true
            });
          }
          layer.on?.({
            mouseover(event) {
              event.target?.setStyle?.({
                weight: 4,
                opacity: 1,
                fillOpacity: 0.4
              });
              event.target?.bringToFront?.();
            },
            mouseout(event) {
              geojsonLayer.resetStyle?.(event.target);
            }
          });
          if (feature.properties) {
            const props = feature.properties;
            const keys = Object.keys(props);
            if (keys.length > 0) {
              const popupContent = document.createElement("div");
              popupContent.className = "ofv-map-popup";
              const popupTitle = document.createElement("h4");
              popupTitle.textContent = "\u5C5E\u6027\u4FE1\u606F";
              popupContent.appendChild(popupTitle);
              const table = document.createElement("table");
              table.className = "ofv-map-popup-table";
              for (const key of keys) {
                const val = props[key];
                if (val === null || val === void 0) continue;
                const row = document.createElement("tr");
                const cellKey = document.createElement("td");
                cellKey.className = "ofv-map-popup-key";
                cellKey.textContent = key;
                const cellVal = document.createElement("td");
                cellVal.className = "ofv-map-popup-val";
                cellVal.textContent = typeof val === "object" ? JSON.stringify(val) : String(val);
                row.append(cellKey, cellVal);
                table.appendChild(row);
              }
              popupContent.appendChild(table);
              layer.bindPopup(popupContent);
            }
          }
        }
      }).addTo(map);
      try {
        const bounds = geojsonLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
          map.invalidateSize();
        }
      } catch (e) {
        console.warn("Could not fit bounds for GeoJSON data:", e);
      }
      const resizeTimers = [0, 80, 240].map((delay) => window.setTimeout(() => {
        map.invalidateSize();
        updateToolbarZoom();
      }, delay));
      return {
        canCommand(command) {
          return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset";
        },
        command(command) {
          if (command === "zoom-in") {
            map.zoomIn?.();
            toolbarZoom = Math.min(3, Number((toolbarZoom + 0.25).toFixed(2)));
            updateToolbarZoom();
            return true;
          }
          if (command === "zoom-out") {
            map.zoomOut?.();
            toolbarZoom = Math.max(0.25, Number((toolbarZoom - 0.25).toFixed(2)));
            updateToolbarZoom();
            return true;
          }
          if (command === "zoom-reset") {
            toolbarZoom = 1;
            map.setView([0, 0], 2);
            try {
              const bounds = geojsonLayer.getBounds();
              if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [20, 20] });
              }
            } catch {
            }
            map.invalidateSize();
            updateToolbarZoom();
            return true;
          }
          return false;
        },
        resize() {
          map.invalidateSize();
          updateToolbarZoom();
        },
        destroy() {
          resizeTimers.forEach((timer) => window.clearTimeout(timer));
          ctx.toolbar?.setZoom(void 0);
          map.remove();
          wrapper.remove();
        }
      };
    }
  };
}
function createGisFallback(titleText, detailText) {
  const fallback = document.createElement("div");
  fallback.className = "ofv-fallback";
  const title = document.createElement("strong");
  title.textContent = titleText;
  const detail = document.createElement("span");
  detail.textContent = detailText;
  fallback.append(title, detail);
  return fallback;
}
function normalizeGisError(error, fileName) {
  const message = error instanceof Error ? error.message : String(error || "");
  return message ? `${fileName}: ${message}` : `${fileName}: \u6587\u4EF6\u5185\u5BB9\u65E0\u6CD5\u8F6C\u6362\u4E3A\u5730\u56FE\u6570\u636E\u3002`;
}
function isGisFallback(value) {
  return typeof value === "object" && value !== null && "fallback" in value;
}
function createGisSummary(summary) {
  const bar = document.createElement("div");
  bar.className = "ofv-gis-summary";
  bar.hidden = summary.features > 0;
  if (summary.features > 0) {
    bar.setAttribute("aria-hidden", "true");
    bar.style.display = "none";
  }
  appendSummaryItem(bar, "\u8981\u7D20", String(summary.features));
  appendSummaryItem(bar, "\u51E0\u4F55", formatGeometryCounts(summary.geometryCounts));
  appendSummaryItem(bar, "\u5C5E\u6027\u5B57\u6BB5", String(summary.propertyKeys.size));
  if (summary.propertyKeys.size > 0) {
    appendSummaryItem(bar, "\u5B57\u6BB5\u9884\u89C8", [...summary.propertyKeys].slice(0, 8).join(", "));
  }
  if (summary.bounds) {
    appendSummaryItem(bar, "\u8303\u56F4", formatBounds(summary.bounds));
  }
  return bar;
}
function createEmptyMapState() {
  const empty = document.createElement("div");
  empty.className = "ofv-map-empty";
  const title = document.createElement("strong");
  title.textContent = "\u6682\u65E0\u53EF\u5C55\u793A\u7684\u5730\u56FE\u8981\u7D20";
  const detail = document.createElement("span");
  detail.textContent = "GeoJSON \u5DF2\u8BC6\u522B\uFF0C\u4F46 features \u4E3A\u7A7A\u3002";
  empty.append(title, detail);
  return empty;
}
function appendSummaryItem(parent, label, value) {
  const item = document.createElement("span");
  const key = document.createElement("span");
  key.textContent = label;
  const content = document.createElement("strong");
  content.textContent = value;
  item.append(key, content);
  parent.append(item);
}
function summarizeGeoJson(geojson) {
  const summary = {
    features: 0,
    geometryCounts: /* @__PURE__ */ new Map(),
    propertyKeys: /* @__PURE__ */ new Set()
  };
  for (const feature of collectFeatures(geojson)) {
    summary.features++;
    if (feature.properties && typeof feature.properties === "object") {
      Object.keys(feature.properties).forEach((key) => summary.propertyKeys.add(key));
    }
    summarizeGeometry(feature.geometry, summary);
  }
  return summary;
}
function collectFeatures(value) {
  if (!value) {
    return [];
  }
  if (value.type === "FeatureCollection" && Array.isArray(value.features)) {
    return value.features;
  }
  if (value.type === "Feature") {
    return [value];
  }
  if (value.type && value.coordinates) {
    return [{ type: "Feature", properties: {}, geometry: value }];
  }
  return [];
}
function summarizeGeometry(geometry, summary) {
  if (!geometry) {
    summary.geometryCounts.set("None", (summary.geometryCounts.get("None") || 0) + 1);
    return;
  }
  const type = String(geometry.type || "Unknown");
  summary.geometryCounts.set(type, (summary.geometryCounts.get(type) || 0) + 1);
  if (type === "GeometryCollection" && Array.isArray(geometry.geometries)) {
    for (const child of geometry.geometries) {
      summarizeGeometry(child, summary);
    }
    return;
  }
  updateBounds(summary, geometry.coordinates);
}
function updateBounds(summary, coordinates) {
  if (!Array.isArray(coordinates)) {
    return;
  }
  if (typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
    const lon = coordinates[0];
    const lat = coordinates[1];
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
      return;
    }
    const bounds = summary.bounds || [lon, lat, lon, lat];
    bounds[0] = Math.min(bounds[0], lon);
    bounds[1] = Math.min(bounds[1], lat);
    bounds[2] = Math.max(bounds[2], lon);
    bounds[3] = Math.max(bounds[3], lat);
    summary.bounds = bounds;
    return;
  }
  for (const item of coordinates) {
    updateBounds(summary, item);
  }
}
function formatGeometryCounts(counts) {
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([type, count]) => `${type} ${count}`).join(", ") || "\u65E0";
}
function formatBounds(bounds) {
  return bounds.map((value) => Number(value.toFixed(5))).join(", ");
}
async function parseToGeoJson(file, buffer, togeojsonLib, topojsonClient, shpLib, JSZipLib) {
  const ext = resolveGisFormat(file);
  if (ext === "geojson") {
    const text = new TextDecoder().decode(buffer);
    return JSON.parse(text);
  }
  if (ext === "topojson") {
    const text = new TextDecoder().decode(buffer);
    const topology = JSON.parse(text);
    const geojsonFeatures = [];
    for (const key of Object.keys(topology.objects)) {
      const feature = topojsonClient.feature(topology, topology.objects[key]);
      if (feature.type === "FeatureCollection") {
        geojsonFeatures.push(...feature.features);
      } else {
        geojsonFeatures.push(feature);
      }
    }
    return {
      type: "FeatureCollection",
      features: geojsonFeatures
    };
  }
  if (ext === "kml") {
    const text = new TextDecoder().decode(buffer);
    const dom = new DOMParser().parseFromString(text, "text/xml");
    return togeojsonLib.kml(dom);
  }
  if (ext === "gpx") {
    const text = new TextDecoder().decode(buffer);
    const dom = new DOMParser().parseFromString(text, "text/xml");
    return togeojsonLib.gpx(dom);
  }
  if (ext === "kmz") {
    const zip = await JSZipLib.loadAsync(buffer);
    const kmlFile = Object.values(zip.files).find((f) => f.name.toLowerCase().endsWith(".kml"));
    if (!kmlFile) {
      throw new Error("No KML file found inside KMZ archive.");
    }
    const kmlText = await kmlFile.async("text");
    const dom = new DOMParser().parseFromString(kmlText, "text/xml");
    return togeojsonLib.kml(dom);
  }
  if (ext === "shp") {
    const u8 = new Uint8Array(buffer);
    const isZip = u8[0] === 80 && u8[1] === 75 && u8[2] === 3 && u8[3] === 4;
    const parsed = await shpLib(isZip ? buffer : { shp: buffer }).catch((error) => {
      if (!isZip) {
        throw new Error(
          `\u5355\u4E2A .shp \u51E0\u4F55\u89E3\u6790\u5931\u8D25\uFF1A${error instanceof Error ? error.message : "\u6587\u4EF6\u5185\u5BB9\u5F02\u5E38"}\u3002\u5982\u9700\u5C5E\u6027\u5B57\u6BB5\uFF0C\u8BF7\u540C\u65F6\u63D0\u4F9B .dbf/.shx \u6216\u4E0A\u4F20 zip\u3002`
        );
      }
      throw error;
    });
    if (Array.isArray(parsed)) {
      const features = [];
      for (const item of parsed) {
        if (item.type === "FeatureCollection") {
          features.push(...item.features);
        } else if (item.type === "Feature") {
          features.push(item);
        }
      }
      return {
        type: "FeatureCollection",
        features
      };
    }
    return parsed;
  }
  try {
    const text = new TextDecoder().decode(buffer);
    return JSON.parse(text);
  } catch {
    throw new Error(`Unsupported GIS format: ${ext}`);
  }
}
function resolveGisFormat(file) {
  const name = file.name.toLowerCase().split("?")[0]?.split("#")[0] || "";
  if (name.endsWith(".geo.json")) {
    return "geojson";
  }
  if (name.endsWith(".topo.json")) {
    return "topojson";
  }
  return resolveFormat(file, gisMimeFormatMap).toLowerCase();
}

// src/plugins/asset.ts
var assetExtensions = /* @__PURE__ */ new Set([
  "ttf",
  "otf",
  "woff",
  "woff2",
  "eot",
  "psd",
  "psb",
  "ai",
  "eps",
  "ps",
  "webarchive",
  "sqlite",
  "sqlite3",
  "db",
  "wasm",
  "parquet",
  "avro"
]);
var assetMimeFormatMap = {
  "font/ttf": "ttf",
  "font/otf": "otf",
  "font/woff": "woff",
  "font/woff2": "woff2",
  "application/vnd.ms-fontobject": "eot",
  "image/vnd.adobe.photoshop": "psd",
  "application/postscript": "ps",
  "application/x-webarchive": "webarchive",
  "application/vnd.sqlite3": "sqlite",
  "application/x-sqlite3": "sqlite",
  "application/wasm": "wasm",
  "application/vnd.apache.parquet": "parquet",
  "application/avro": "avro"
};
var assetMimeTypes = new Set(Object.keys(assetMimeFormatMap));
function assetPlugin() {
  return {
    name: "asset",
    match(file) {
      return assetExtensions.has(file.extension) || assetMimeTypes.has(file.mimeType);
    },
    async render(ctx) {
      const panel = createPanel("ofv-asset");
      ctx.viewport.append(panel);
      const url = createObjectUrl(ctx.file);
      const isExternal = Boolean(ctx.file.url);
      const extension = resolveFormat(ctx.file, assetMimeFormatMap).toLowerCase();
      const bytes = new Uint8Array(await readArrayBuffer(ctx.file).catch(() => new ArrayBuffer(0)));
      if (isPhotoshopAsset(extension)) {
        const photoshopPreview = await createPhotoshopPreview(bytes, ctx.toolbar);
        panel.append(photoshopPreview.element);
        ctx.toolbar?.refreshCommandSupport();
        return {
          canCommand(command) {
            return photoshopPreview.instance?.canCommand?.(command) ?? false;
          },
          command(command) {
            return photoshopPreview.instance?.command?.(command) ?? false;
          },
          resize(size) {
            photoshopPreview.instance?.resize?.(size);
          },
          destroy() {
            photoshopPreview.instance?.destroy();
            revokeObjectUrl(url, isExternal);
            panel.remove();
          }
        };
      }
      if (extension === "ai" || extension === "eps" || extension === "ps") {
        const postScriptPreview = await createPostScriptPreview(bytes, url, ctx.file.name, ctx.size, ctx.options.fit, ctx.toolbar);
        panel.append(postScriptPreview.element);
        if (postScriptPreview.primaryRendered) {
          hideSuccessfulAssetDiagnostics(panel);
          ctx.toolbar?.refreshCommandSupport();
          return {
            canCommand(command) {
              return postScriptPreview.instance?.canCommand?.(command) ?? false;
            },
            command(command) {
              return postScriptPreview.instance?.command?.(command) ?? false;
            },
            resize(size) {
              postScriptPreview.instance?.resize?.(size);
            },
            destroy() {
              postScriptPreview.instance?.destroy();
              revokeObjectUrl(url, isExternal);
              panel.remove();
            }
          };
        }
        return {
          canCommand(command) {
            return postScriptPreview.instance?.canCommand?.(command) ?? false;
          },
          command(command) {
            return postScriptPreview.instance?.command?.(command) ?? false;
          },
          resize(size) {
            postScriptPreview.instance?.resize?.(size);
          },
          destroy() {
            postScriptPreview.instance?.destroy();
            revokeObjectUrl(url, isExternal);
            panel.remove();
          }
        };
      }
      const section = createSection(assetTitle(extension));
      const summary = document.createElement("div");
      summary.className = "ofv-asset-summary";
      appendMeta(summary, "\u6587\u4EF6", ctx.file.name);
      appendMeta(summary, "\u683C\u5F0F", extension ? `.${extension}` : ctx.file.mimeType || "\u672A\u77E5");
      appendMeta(summary, "\u5927\u5C0F", formatBytes4(ctx.file.size ?? bytes.byteLength));
      appendMeta(summary, "\u7B7E\u540D", byteSignature3(bytes));
      hideSupplementalInfo8(summary);
      const note = document.createElement("p");
      note.textContent = assetGuidance(extension);
      hideSupplementalInfo8(note);
      const download = document.createElement("a");
      download.className = "ofv-asset-download";
      download.href = url;
      download.download = ctx.file.name;
      download.textContent = "\u4E0B\u8F7D\u6587\u4EF6";
      download.hidden = true;
      download.setAttribute("aria-hidden", "true");
      download.style.display = "none";
      section.append(summary, note, download);
      const childInstances = [];
      let hasPrimaryPreview = false;
      if (isFontAsset(extension)) {
        hideSuccessfulSectionHeading4(section);
        section.append(await createFontPreview(extension, url, ctx.file.name, bytes));
        hasPrimaryPreview = true;
      }
      if (extension === "wasm") {
        section.append(createWasmPreview(bytes));
        hasPrimaryPreview = true;
      }
      if (extension === "sqlite" || extension === "sqlite3" || extension === "db") {
        section.append(createSqlitePreview(bytes));
        hasPrimaryPreview = true;
      }
      if (extension === "parquet") {
        section.append(createParquetPreview(bytes));
        hasPrimaryPreview = true;
      }
      if (extension === "avro") {
        section.append(createAvroPreview(bytes));
        hasPrimaryPreview = true;
      }
      if (extension === "webarchive") {
        section.append(createWebArchivePreview(bytes));
        hasPrimaryPreview = true;
      }
      if (hasPrimaryPreview) {
        hideSuccessfulSectionHeading4(section);
      }
      const preview = shouldShowHexPreview(extension, hasPrimaryPreview) ? createHexPreview(bytes) : null;
      if (preview) {
        section.append(preview);
      }
      panel.append(section);
      return {
        canCommand(command) {
          return childInstances.some((instance) => instance.canCommand?.(command));
        },
        command(command) {
          for (const instance of childInstances) {
            if (instance.canCommand?.(command)) {
              return instance.command?.(command) ?? false;
            }
          }
          return false;
        },
        resize(size) {
          childInstances.forEach((instance) => instance.resize?.(size));
        },
        destroy() {
          childInstances.forEach((instance) => instance.destroy());
          revokeObjectUrl(url, isExternal);
          panel.remove();
        }
      };
    }
  };
}
function assetTitle(extension) {
  if (isFontAsset(extension)) {
    return "\u5B57\u4F53\u6587\u4EF6\u9884\u89C8";
  }
  if (["psd", "psb", "ai", "eps", "ps"].includes(extension)) {
    return "\u8BBE\u8BA1\u6587\u4EF6\u9884\u89C8";
  }
  if (["sqlite", "sqlite3", "db", "parquet", "avro"].includes(extension)) {
    return "\u6570\u636E\u6587\u4EF6\u9884\u89C8";
  }
  if (extension === "wasm") {
    return "WebAssembly \u6587\u4EF6\u9884\u89C8";
  }
  if (extension === "webarchive") {
    return "\u7F51\u9875\u5F52\u6863\u9884\u89C8";
  }
  return "\u8D44\u4EA7\u6587\u4EF6\u9884\u89C8";
}
function assetGuidance(extension) {
  if (isFontAsset(extension)) {
    return "\u5B57\u4F53\u6587\u4EF6\u5DF2\u8BC6\u522B\uFF0C\u5F53\u524D\u4F1A\u4F7F\u7528 FontFace \u5C55\u793A\u5B57\u5F62\u6837\u5F20\uFF0C\u5E76\u89E3\u6790 sfnt/WOFF \u8868\u76EE\u5F55\u548C name \u5143\u4FE1\u606F\u3002";
  }
  if (extension === "psd" || extension === "psb") {
    return "PSD/PSB \u5DF2\u8BC6\u522B\uFF0C\u5F53\u524D\u4F1A\u4F18\u5148\u89E3\u6790 Photoshop \u5408\u6210\u56FE\u9884\u89C8\uFF0C\u5E76\u4FDD\u7559\u753B\u5E03\u3001\u901A\u9053\u3001\u4F4D\u6DF1\u548C\u989C\u8272\u6A21\u5F0F\u7B49\u7ED3\u6784\u4FE1\u606F\u3002";
  }
  if (["ai", "eps", "ps"].includes(extension)) {
    return "PostScript/Illustrator \u6587\u4EF6\u5DF2\u8BC6\u522B\uFF1BPDF-compatible AI \u4F1A\u76F4\u63A5\u4F7F\u7528\u6D4F\u89C8\u5668 PDF \u9884\u89C8\uFF0CEPS/PS \u4F1A\u89E3\u6790\u6587\u6863\u5934\u3001BoundingBox \u548C\u5E38\u89C1 DSC \u5143\u4FE1\u606F\u3002";
  }
  if (["sqlite", "sqlite3", "db"].includes(extension)) {
    return "SQLite \u6570\u636E\u5E93\u5DF2\u8BC6\u522B\uFF0C\u5F53\u524D\u4F1A\u89E3\u6790\u6570\u636E\u5E93\u5934\u3001sqlite_schema \u6458\u8981\uFF0C\u5E76\u5BF9\u5E38\u89C1 table leaf page \u505A\u524D\u7AEF\u62BD\u6837\u9884\u89C8\uFF1B\u590D\u6742\u67E5\u8BE2\u53EF\u63A5\u5165 sqlite-wasm \u589E\u5F3A\u3002";
  }
  if (extension === "parquet" || extension === "avro") {
    return "\u5217\u5F0F/\u5E8F\u5217\u5316\u6570\u636E\u6587\u4EF6\u5DF2\u8BC6\u522B\uFF0C\u5F53\u524D\u4F1A\u89E3\u6790\u5BB9\u5668\u5934\u3001\u5143\u4FE1\u606F\u548C schema \u6458\u8981\uFF1B\u62BD\u6837\u8BB0\u5F55\u53EF\u540E\u7EED\u63A5\u5165\u4E13\u7528\u89E3\u6790\u5668\u589E\u5F3A\u3002";
  }
  if (extension === "wasm") {
    return "WASM \u6A21\u5757\u5DF2\u8BC6\u522B\uFF0C\u5F53\u524D\u4F1A\u89E3\u6790\u7248\u672C\u3001section \u5206\u5E03\u3001imports\u3001exports \u548C\u81EA\u5B9A\u4E49 section \u6458\u8981\u3002";
  }
  if (extension === "webarchive") {
    return "WebArchive \u5DF2\u8BC6\u522B\uFF0C\u5F53\u524D\u4F1A\u89E3\u6790 XML plist \u4E3B\u8D44\u6E90\u3001MIME\u3001\u7F16\u7801\u548C\u5B50\u8D44\u6E90\u6570\u91CF\uFF1B\u5B8C\u6574\u7F51\u9875\u8FD8\u539F\u53EF\u540E\u7EED\u63A5\u5165\u8D44\u6E90\u5305\u8F6C\u6362\u3002";
  }
  return "\u8BE5\u8D44\u4EA7\u6587\u4EF6\u5DF2\u8BC6\u522B\uFF0C\u5F53\u524D\u63D0\u4F9B\u6587\u4EF6\u6307\u7EB9\u548C\u4E0B\u8F7D\u5165\u53E3\uFF0C\u540E\u7EED\u53EF\u63A5\u5165\u4E13\u7528\u89E3\u6790\u5668\u589E\u5F3A\u3002";
}
function isFontAsset(extension) {
  return ["ttf", "otf", "woff", "woff2", "eot"].includes(extension);
}
function isPhotoshopAsset(extension) {
  return extension === "psd" || extension === "psb";
}
async function createFontPreview(extension, url, fileName, bytes) {
  const preview = document.createElement("div");
  preview.className = "ofv-font-preview";
  const heading = document.createElement("strong");
  heading.textContent = "\u5B57\u4F53\u6837\u5F20";
  const sample = document.createElement("div");
  sample.className = "ofv-font-sample";
  sample.textContent = "Open File Viewer \u9884\u89C8 1234567890";
  const pangram = document.createElement("div");
  pangram.className = "ofv-font-pangram";
  pangram.textContent = "The quick brown fox jumps over the lazy dog.";
  const meta = document.createElement("span");
  meta.className = "ofv-font-status";
  preview.append(heading, sample, pangram, meta);
  if (!("FontFace" in window) || !document.fonts) {
    meta.textContent = "\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301 FontFace API\uFF0C\u65E0\u6CD5\u751F\u6210\u5B9E\u65F6\u5B57\u5F62\u6837\u5F20\u3002";
    preview.append(createFontInfoPreview(bytes, extension));
    return preview;
  }
  const family = `ofv-${fileName.replace(/[^a-z0-9_-]/gi, "-")}-${Date.now()}`;
  const format = fontFaceFormat(extension);
  const source = format ? `url("${url}") format("${format}")` : `url("${url}")`;
  let sampleRendered = false;
  try {
    const fontFace = new FontFace(family, source);
    const loaded = await fontFace.load();
    document.fonts.add(loaded);
    sample.style.fontFamily = `"${family}", sans-serif`;
    pangram.style.fontFamily = `"${family}", sans-serif`;
    meta.textContent = "\u5DF2\u4F7F\u7528\u6D4F\u89C8\u5668 FontFace API \u52A0\u8F7D\u5B57\u4F53\u6837\u5F20\u3002";
    hideSupplementalInfo8(meta);
    sampleRendered = true;
  } catch (error) {
    meta.textContent = `\u5B57\u4F53\u6837\u5F20\u52A0\u8F7D\u5931\u8D25\uFF1A${error instanceof Error ? error.message : "\u5F53\u524D\u5B57\u4F53\u7F16\u7801\u6682\u4E0D\u53D7\u6D4F\u89C8\u5668\u652F\u6301\u3002"}`;
  }
  const info = createFontInfoPreview(bytes, extension);
  const hasVisibleFontDiagnostic = Boolean(info.querySelector(".ofv-data-error"));
  if (sampleRendered || !hasVisibleFontDiagnostic) {
    hideSupplementalInfo8(info);
  }
  preview.append(info);
  return preview;
}
function fontFaceFormat(extension) {
  const map = {
    ttf: "truetype",
    otf: "opentype",
    woff: "woff",
    woff2: "woff2",
    eot: "embedded-opentype"
  };
  return map[extension] || "";
}
function createFontInfoPreview(bytes, extension) {
  const wrapper = document.createElement("div");
  wrapper.className = "ofv-font-info";
  const heading = document.createElement("strong");
  heading.textContent = "\u5B57\u4F53\u7ED3\u6784";
  wrapper.append(heading);
  const parsed = parseFontInfo(bytes, extension);
  if (!parsed.valid) {
    const error = document.createElement("p");
    error.className = "ofv-data-error";
    error.textContent = parsed.error || "\u65E0\u6CD5\u89E3\u6790\u5B57\u4F53\u7ED3\u6784\u3002";
    wrapper.append(error);
    return wrapper;
  }
  const summary = document.createElement("div");
  summary.className = "ofv-data-summary";
  appendMeta(summary, "\u5BB9\u5668", parsed.container || "sfnt");
  appendMeta(summary, "Flavor", parsed.flavor || "\u672A\u77E5");
  appendMeta(summary, "\u8868\u6570\u91CF", parsed.tables.length);
  if (parsed.totalSfntSize !== void 0) {
    appendMeta(summary, "\u5C55\u5F00\u5927\u5C0F", formatBytes4(parsed.totalSfntSize));
  }
  for (const item of parsed.meta || []) {
    appendMeta(summary, item.label, item.value);
  }
  wrapper.append(summary);
  if (parsed.error) {
    const note = document.createElement("p");
    note.className = "ofv-data-note";
    note.textContent = parsed.error;
    wrapper.append(note);
  }
  if (parsed.names.length > 0) {
    wrapper.append(createKeyValueTable("Name", parsed.names.map((item) => ({ key: item.label, value: item.value }))));
  }
  if (parsed.tables.length > 0) {
    wrapper.append(createFontTablePreview(parsed.tables));
  }
  return wrapper;
}
function createFontTablePreview(tables) {
  const wrapper = document.createElement("div");
  wrapper.className = "ofv-font-tables";
  const title = document.createElement("strong");
  title.textContent = "Tables";
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const label of ["Tag", "Offset", "Length", "Compressed", "Checksum"]) {
    const th = document.createElement("th");
    th.textContent = label;
    headRow.append(th);
  }
  thead.append(headRow);
  const tbody = document.createElement("tbody");
  for (const entry of tables.slice(0, 80)) {
    const row = document.createElement("tr");
    for (const value of [
      entry.tag,
      `0x${entry.offset.toString(16).toUpperCase()}`,
      formatBytes4(entry.length),
      entry.compressedLength === void 0 ? "-" : formatBytes4(entry.compressedLength),
      entry.checksum === void 0 ? "-" : `0x${entry.checksum.toString(16).padStart(8, "0").toUpperCase()}`
    ]) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    }
    tbody.append(row);
  }
  table.append(thead, tbody);
  wrapper.append(title, table);
  return wrapper;
}
function parseFontInfo(bytes, extension) {
  if (bytes.length < 4) {
    return { valid: false, error: "\u6587\u4EF6\u592A\u77ED\uFF0C\u65E0\u6CD5\u8BFB\u53D6\u5B57\u4F53\u5934\u3002", tables: [], names: [] };
  }
  const signature = asciiAt4(bytes, 0, 4);
  if (signature === "wOFF") {
    return parseWoffFont(bytes);
  }
  if (signature === "wOF2") {
    return parseWoff2Font(bytes);
  }
  if (extension === "eot") {
    return parseEotFont(bytes);
  }
  return parseSfntFont(bytes, 0, "sfnt");
}
function parseSfntFont(bytes, offset, container) {
  if (offset + 12 > bytes.length) {
    return { valid: false, error: "\u6587\u4EF6\u592A\u77ED\uFF0C\u65E0\u6CD5\u8BFB\u53D6 sfnt offset table\u3002", tables: [], names: [] };
  }
  const flavor = fontFlavor(bytes, offset);
  if (!flavor) {
    return { valid: false, error: "\u7F3A\u5C11\u6709\u6548\u7684 TrueType/OpenType sfnt \u5934\u3002", tables: [], names: [] };
  }
  const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tableCount = view3.getUint16(offset + 4, false);
  const directoryEnd = offset + 12 + tableCount * 16;
  if (tableCount <= 0 || directoryEnd > bytes.length) {
    return { valid: false, error: "sfnt \u8868\u76EE\u5F55\u8D85\u51FA\u6587\u4EF6\u8FB9\u754C\u3002", tables: [], names: [] };
  }
  const tables = [];
  for (let index = 0; index < tableCount; index++) {
    const entryOffset = offset + 12 + index * 16;
    tables.push({
      tag: asciiAt4(bytes, entryOffset, 4),
      checksum: view3.getUint32(entryOffset + 4, false),
      offset: view3.getUint32(entryOffset + 8, false),
      length: view3.getUint32(entryOffset + 12, false)
    });
  }
  return {
    valid: true,
    container,
    flavor,
    tables,
    names: parseFontNameTable(bytes, tables.find((table) => table.tag === "name"))
  };
}
function parseWoffFont(bytes) {
  if (bytes.length < 44) {
    return { valid: false, error: "\u6587\u4EF6\u592A\u77ED\uFF0C\u65E0\u6CD5\u8BFB\u53D6 WOFF \u5934\u3002", tables: [], names: [] };
  }
  const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tableCount = view3.getUint16(12, false);
  const directoryEnd = 44 + tableCount * 20;
  if (tableCount <= 0 || directoryEnd > bytes.length) {
    return { valid: false, error: "WOFF \u8868\u76EE\u5F55\u8D85\u51FA\u6587\u4EF6\u8FB9\u754C\u3002", tables: [], names: [] };
  }
  const tables = [];
  for (let index = 0; index < tableCount; index++) {
    const entryOffset = 44 + index * 20;
    tables.push({
      tag: asciiAt4(bytes, entryOffset, 4),
      offset: view3.getUint32(entryOffset + 4, false),
      compressedLength: view3.getUint32(entryOffset + 8, false),
      length: view3.getUint32(entryOffset + 12, false),
      checksum: view3.getUint32(entryOffset + 16, false)
    });
  }
  return {
    valid: true,
    container: "WOFF",
    flavor: fontFlavor(bytes, 4) || asciiAt4(bytes, 4, 4),
    tables,
    names: parseFontNameTable(bytes, tables.find((table) => table.tag === "name" && table.compressedLength === table.length)),
    totalSfntSize: view3.getUint32(16, false)
  };
}
function parseWoff2Font(bytes) {
  if (bytes.length < 48) {
    return { valid: false, error: "\u6587\u4EF6\u592A\u77ED\uFF0C\u65E0\u6CD5\u8BFB\u53D6 WOFF2 \u5934\u3002", tables: [], names: [] };
  }
  const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const tableCount = view3.getUint16(12, false);
  let offset = 48;
  const tables = [];
  for (let index = 0; index < tableCount; index++) {
    if (offset >= bytes.length) {
      return { valid: false, error: "WOFF2 \u8868\u76EE\u5F55\u8D85\u51FA\u6587\u4EF6\u8FB9\u754C\u3002", tables: [], names: [] };
    }
    const flags = bytes[offset++];
    const knownTag = flags & 63;
    let tag = woff2KnownTableTag(knownTag);
    if (knownTag === 63) {
      if (offset + 4 > bytes.length) {
        return { valid: false, error: "WOFF2 \u81EA\u5B9A\u4E49\u8868 tag \u8D85\u51FA\u6587\u4EF6\u8FB9\u754C\u3002", tables: [], names: [] };
      }
      tag = asciiAt4(bytes, offset, 4);
      offset += 4;
    }
    const originalLength = read255UInt16(bytes, offset);
    if (!originalLength) {
      return { valid: false, error: "WOFF2 \u8868\u76EE\u5F55\u957F\u5EA6\u5B57\u6BB5\u4E0D\u5B8C\u6574\u3002", tables: [], names: [] };
    }
    offset = originalLength.offset;
    let transformedLength;
    const hasTransform = (flags & 192) !== 0 || tag === "glyf" && (flags & 192) !== 0 || tag === "loca" && (flags & 192) !== 0;
    if (hasTransform && tag !== "loca") {
      const transformed = read255UInt16(bytes, offset);
      if (!transformed) {
        return { valid: false, error: "WOFF2 transformLength \u5B57\u6BB5\u4E0D\u5B8C\u6574\u3002", tables: [], names: [] };
      }
      transformedLength = transformed.value;
      offset = transformed.offset;
    }
    tables.push({
      tag,
      offset: 0,
      length: originalLength.value,
      compressedLength: transformedLength
    });
  }
  return {
    valid: true,
    container: "WOFF2",
    flavor: fontFlavor(bytes, 4) || asciiAt4(bytes, 4, 4),
    tables,
    names: [],
    totalSfntSize: view3.getUint32(16, false),
    meta: [
      { label: "\u538B\u7F29\u6570\u636E", value: formatBytes4(view3.getUint32(20, false)) },
      { label: "Meta", value: view3.getUint32(32, false) > 0 ? `${formatBytes4(view3.getUint32(36, false))} @ 0x${view3.getUint32(32, false).toString(16).toUpperCase()}` : "\u65E0" },
      { label: "Private", value: view3.getUint32(40, false) > 0 ? `${formatBytes4(view3.getUint32(44, false))} @ 0x${view3.getUint32(40, false).toString(16).toUpperCase()}` : "\u65E0" }
    ],
    error: "WOFF2 \u5DF2\u89E3\u6790\u5BB9\u5668\u5934\u548C\u538B\u7F29\u8868\u76EE\u5F55\uFF1Bname \u8868\u5185\u5BB9\u9700 Brotli \u89E3\u538B\u540E\u624D\u80FD\u5C55\u5F00\u3002"
  };
}
function parseEotFont(bytes) {
  if (bytes.length < 82) {
    return { valid: false, error: "\u6587\u4EF6\u592A\u77ED\uFF0C\u65E0\u6CD5\u8BFB\u53D6 EOT \u5934\u3002", tables: [], names: [] };
  }
  const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const eotSize = view3.getUint32(0, true);
  const fontDataSize = view3.getUint32(4, true);
  const version = view3.getUint32(8, true);
  const flags = view3.getUint32(12, true);
  const panose = Array.from(bytes.slice(16, 26)).map((item) => item.toString(16).padStart(2, "0")).join(" ");
  const charset = bytes[26];
  const italic = bytes[27];
  const weight = view3.getUint32(28, true);
  let offset = 68;
  const names = [];
  const fields = [
    { id: 1, label: "Family", padded: true },
    { id: 2, label: "Subfamily", padded: true },
    { id: 5, label: "Version", padded: true },
    { id: 4, label: "Full name", padded: true },
    { id: 0, label: "Root strings", padded: false }
  ];
  for (const field of fields) {
    const fieldValue = readEotStringField(bytes, offset, field.padded);
    if (!fieldValue) {
      break;
    }
    offset = fieldValue.offset;
    if (field.id > 0 && fieldValue.value) {
      names.push({ id: field.id, label: field.label, value: fieldValue.value });
    }
  }
  if (offset + 4 <= bytes.length) {
    offset += 4;
  }
  const sfntOffset = findEmbeddedSfntOffset(bytes, offset);
  const embedded = sfntOffset === void 0 ? void 0 : parseSfntFont(bytes, sfntOffset, "EOT embedded sfnt");
  return {
    valid: true,
    container: "EOT",
    flavor: embedded?.valid ? embedded.flavor : "Embedded OpenType",
    tables: embedded?.valid ? embedded.tables : [],
    names: embedded?.valid && embedded.names.length > 0 ? embedded.names : names,
    totalSfntSize: fontDataSize || void 0,
    meta: [
      { label: "EOT \u5927\u5C0F", value: eotSize ? formatBytes4(eotSize) : "\u672A\u58F0\u660E" },
      { label: "\u7248\u672C", value: `0x${version.toString(16).toUpperCase()}` },
      { label: "Flags", value: `0x${flags.toString(16).toUpperCase()}` },
      { label: "Weight", value: weight || "\u672A\u58F0\u660E" },
      { label: "Italic", value: italic ? "\u662F" : "\u5426" },
      { label: "Charset", value: charset },
      { label: "PANOSE", value: panose },
      { label: "sfnt \u504F\u79FB", value: sfntOffset === void 0 ? "\u672A\u627E\u5230" : `0x${sfntOffset.toString(16).toUpperCase()}` }
    ],
    error: embedded?.valid ? void 0 : "\u5DF2\u89E3\u6790 EOT \u5BB9\u5668\u5934\u548C\u540D\u79F0\u5B57\u6BB5\uFF0C\u4F46\u672A\u627E\u5230\u53EF\u5C55\u5F00\u7684\u5185\u5D4C sfnt \u8868\u76EE\u5F55\u3002"
  };
}
function readEotStringField(bytes, offset, padded) {
  const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (padded) {
    if (offset + 2 > bytes.length) {
      return void 0;
    }
    offset += 2;
  }
  if (offset + 2 > bytes.length) {
    return void 0;
  }
  const length = view3.getUint16(offset, true);
  offset += 2;
  if (offset + length > bytes.length) {
    return void 0;
  }
  const value = length > 0 ? decodeEotString(bytes.slice(offset, offset + length)) : "";
  return { value, offset: offset + length };
}
function woff2KnownTableTag(index) {
  const tags = [
    "cmap",
    "head",
    "hhea",
    "hmtx",
    "maxp",
    "name",
    "OS/2",
    "post",
    "cvt ",
    "fpgm",
    "glyf",
    "loca",
    "prep",
    "CFF ",
    "VORG",
    "EBDT",
    "EBLC",
    "gasp",
    "hdmx",
    "kern",
    "LTSH",
    "PCLT",
    "VDMX",
    "vhea",
    "vmtx",
    "BASE",
    "GDEF",
    "GPOS",
    "GSUB",
    "EBSC",
    "JSTF",
    "MATH",
    "CBDT",
    "CBLC",
    "COLR",
    "CPAL",
    "SVG ",
    "sbix",
    "acnt",
    "avar",
    "bdat",
    "bloc",
    "bsln",
    "cvar",
    "fdsc",
    "feat",
    "fmtx",
    "fvar",
    "gvar",
    "hsty",
    "just",
    "lcar",
    "mort",
    "morx",
    "opbd",
    "prop",
    "trak",
    "Zapf",
    "Silf",
    "Glat",
    "Gloc",
    "Feat",
    "Sill"
  ];
  return tags[index] || `table-${index}`;
}
function read255UInt16(bytes, offset) {
  if (offset >= bytes.length) {
    return void 0;
  }
  const code = bytes[offset++];
  if (code === 253) {
    if (offset + 2 > bytes.length) {
      return void 0;
    }
    return { value: bytes[offset] << 8 | bytes[offset + 1], offset: offset + 2 };
  }
  if (code === 254) {
    if (offset >= bytes.length) {
      return void 0;
    }
    return { value: bytes[offset] + 506, offset: offset + 1 };
  }
  if (code === 255) {
    if (offset >= bytes.length) {
      return void 0;
    }
    return { value: bytes[offset] + 253, offset: offset + 1 };
  }
  return { value: code, offset };
}
function decodeEotString(bytes) {
  const text = decodeUtf16Le(bytes).replace(/\0+$/g, "").trim();
  return text || new TextDecoder("latin1").decode(bytes).replace(/\0+$/g, "").trim();
}
function decodeUtf16Le(bytes) {
  let value = "";
  for (let index = 0; index + 1 < bytes.length; index += 2) {
    value += String.fromCharCode(bytes[index] | bytes[index + 1] << 8);
  }
  return value;
}
function findEmbeddedSfntOffset(bytes, start) {
  for (let offset = Math.max(0, start); offset + 12 <= bytes.length; offset++) {
    const flavor = fontFlavor(bytes, offset);
    if (!flavor) {
      continue;
    }
    const tableCount = bytes[offset + 4] << 8 | bytes[offset + 5];
    const directoryEnd = offset + 12 + tableCount * 16;
    if (tableCount > 0 && directoryEnd <= bytes.length) {
      return offset;
    }
  }
  return void 0;
}
function fontFlavor(bytes, offset) {
  if (offset + 4 > bytes.length) {
    return void 0;
  }
  const ascii = asciiAt4(bytes, offset, 4);
  if (ascii === "OTTO") {
    return "OpenType/CFF";
  }
  if (ascii === "true") {
    return "Apple TrueType";
  }
  if (ascii === "typ1") {
    return "Type 1 sfnt";
  }
  if (bytes[offset] === 0 && bytes[offset + 1] === 1 && bytes[offset + 2] === 0 && bytes[offset + 3] === 0) {
    return "TrueType";
  }
  return void 0;
}
function parseFontNameTable(bytes, table) {
  if (!table || table.offset + table.length > bytes.length || table.length < 6) {
    return [];
  }
  const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const offset = table.offset;
  const count = view3.getUint16(offset + 2, false);
  const storageOffset = view3.getUint16(offset + 4, false);
  const recordsEnd = offset + 6 + count * 12;
  if (recordsEnd > bytes.length || storageOffset > table.length) {
    return [];
  }
  const wanted = /* @__PURE__ */ new Map([
    [1, "Family"],
    [2, "Subfamily"],
    [4, "Full name"],
    [5, "Version"],
    [6, "PostScript name"],
    [8, "Manufacturer"],
    [13, "License"],
    [16, "Typographic family"],
    [17, "Typographic subfamily"]
  ]);
  const names = /* @__PURE__ */ new Map();
  for (let index = 0; index < count; index++) {
    const recordOffset = offset + 6 + index * 12;
    const platformId = view3.getUint16(recordOffset, false);
    const encodingId = view3.getUint16(recordOffset + 2, false);
    const languageId = view3.getUint16(recordOffset + 4, false);
    const nameId = view3.getUint16(recordOffset + 6, false);
    const length = view3.getUint16(recordOffset + 8, false);
    const stringOffset = view3.getUint16(recordOffset + 10, false);
    const label = wanted.get(nameId);
    if (!label || names.has(nameId)) {
      continue;
    }
    const start = offset + storageOffset + stringOffset;
    const end = start + length;
    if (end > bytes.length || end > offset + table.length) {
      continue;
    }
    const value = decodeFontName(bytes.slice(start, end), platformId, encodingId).trim();
    if (value) {
      names.set(nameId, { id: nameId, label: languageId ? `${label} (${languageId.toString(16).toUpperCase()})` : label, value });
    }
  }
  return [...names.values()];
}
function decodeFontName(bytes, platformId, encodingId) {
  if (platformId === 0 || platformId === 3 || platformId === 2 && encodingId === 1) {
    return decodeUtf16Be(bytes);
  }
  return new TextDecoder("latin1").decode(bytes);
}
function decodeUtf16Be(bytes) {
  let value = "";
  for (let index = 0; index + 1 < bytes.length; index += 2) {
    value += String.fromCharCode(bytes[index] << 8 | bytes[index + 1]);
  }
  return value;
}
function createWasmPreview(bytes) {
  const preview = document.createElement("div");
  preview.className = "ofv-wasm-preview";
  const parsed = parseWasm(bytes);
  const heading = document.createElement("strong");
  heading.textContent = "WASM \u7ED3\u6784";
  preview.append(heading);
  if (!parsed.valid) {
    const error = document.createElement("p");
    error.className = "ofv-wasm-error";
    error.textContent = parsed.error || "\u4E0D\u662F\u6709\u6548\u7684 WebAssembly \u4E8C\u8FDB\u5236\u6A21\u5757\u3002";
    preview.append(error);
    return preview;
  }
  const summary = document.createElement("div");
  summary.className = "ofv-wasm-summary";
  appendMeta(summary, "\u7248\u672C", parsed.version ?? "\u672A\u77E5");
  appendMeta(summary, "Sections", parsed.sections.length);
  appendMeta(summary, "Imports", parsed.imports.length);
  appendMeta(summary, "Exports", parsed.exports.length);
  preview.append(summary);
  const sectionTable = createWasmSectionTable(parsed.sections);
  preview.append(sectionTable);
  if (parsed.imports.length > 0) {
    const imports = createWasmList("\u5BFC\u5165", parsed.imports.map((item) => `${item.module}.${item.name} \xB7 ${item.kind}`));
    preview.append(imports);
  }
  if (parsed.exports.length > 0) {
    const exports = createWasmList("\u5BFC\u51FA", parsed.exports.map((item) => `${item.name} \xB7 ${item.kind} #${item.index}`));
    preview.append(exports);
  }
  return preview;
}
function createWasmSectionTable(sections) {
  const table = document.createElement("table");
  table.className = "ofv-wasm-sections";
  const thead = document.createElement("thead");
  const header = document.createElement("tr");
  for (const label of ["Section", "\u5927\u5C0F", "\u504F\u79FB"]) {
    const th = document.createElement("th");
    th.textContent = label;
    header.append(th);
  }
  thead.append(header);
  const tbody = document.createElement("tbody");
  for (const section of sections.slice(0, 80)) {
    const row = document.createElement("tr");
    const name = document.createElement("td");
    name.textContent = section.customName ? `${section.name} (${section.customName})` : section.name;
    const size = document.createElement("td");
    size.textContent = formatBytes4(section.size);
    const offset = document.createElement("td");
    offset.textContent = `0x${section.offset.toString(16).toUpperCase()}`;
    row.append(name, size, offset);
    tbody.append(row);
  }
  table.append(thead, tbody);
  return table;
}
function createWasmList(titleText, rows) {
  const details = document.createElement("details");
  details.className = "ofv-details ofv-wasm-list";
  details.open = true;
  const summary = document.createElement("summary");
  summary.textContent = `${titleText} ${rows.length}`;
  const list = document.createElement("ul");
  for (const row of rows.slice(0, 120)) {
    const item = document.createElement("li");
    item.textContent = row;
    list.append(item);
  }
  if (rows.length > 120) {
    const item = document.createElement("li");
    item.textContent = `\u8FD8\u6709 ${rows.length - 120} \u9879\u672A\u5C55\u793A\u3002`;
    list.append(item);
  }
  details.append(summary, list);
  return details;
}
function parseWasm(bytes) {
  if (bytes.length < 8 || bytes[0] !== 0 || bytes[1] !== 97 || bytes[2] !== 115 || bytes[3] !== 109) {
    return { valid: false, error: "\u7F3A\u5C11 WebAssembly magic header\u3002", sections: [], imports: [], exports: [] };
  }
  const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const version = view3.getUint32(4, true);
  const sections = [];
  const imports = [];
  const exports = [];
  let offset = 8;
  try {
    while (offset < bytes.length) {
      const sectionOffset = offset;
      const id = bytes[offset++];
      const sizeInfo = readVarUint(bytes, offset);
      offset = sizeInfo.offset;
      const payloadOffset = offset;
      const payloadEnd = payloadOffset + sizeInfo.value;
      if (payloadEnd > bytes.length) {
        throw new Error("section \u957F\u5EA6\u8D85\u8FC7\u6587\u4EF6\u8FB9\u754C\u3002");
      }
      const section = {
        id,
        name: wasmSectionName(id),
        size: sizeInfo.value,
        offset: sectionOffset
      };
      if (id === 0) {
        const customName = readWasmName(bytes, payloadOffset, payloadEnd);
        section.customName = customName.value || void 0;
      } else if (id === 2) {
        imports.push(...parseWasmImports(bytes, payloadOffset, payloadEnd));
      } else if (id === 7) {
        exports.push(...parseWasmExports(bytes, payloadOffset, payloadEnd));
      }
      sections.push(section);
      offset = payloadEnd;
    }
  } catch (error) {
    return {
      valid: false,
      version,
      error: error instanceof Error ? error.message : "WASM section \u89E3\u6790\u5931\u8D25\u3002",
      sections,
      imports,
      exports
    };
  }
  return { valid: true, version, sections, imports, exports };
}
function parseWasmImports(bytes, offset, end) {
  const imports = [];
  const count = readVarUint(bytes, offset);
  offset = count.offset;
  for (let index = 0; index < count.value && offset < end; index++) {
    const moduleName = readWasmName(bytes, offset, end);
    offset = moduleName.offset;
    const importName = readWasmName(bytes, offset, end);
    offset = importName.offset;
    const kind = bytes[offset++];
    offset = skipWasmImportDescriptor(bytes, offset, end, kind);
    imports.push({ module: moduleName.value, name: importName.value, kind: wasmExternalKind(kind) });
  }
  return imports;
}
function parseWasmExports(bytes, offset, end) {
  const exports = [];
  const count = readVarUint(bytes, offset);
  offset = count.offset;
  for (let index = 0; index < count.value && offset < end; index++) {
    const exportName = readWasmName(bytes, offset, end);
    offset = exportName.offset;
    const kind = bytes[offset++];
    const itemIndex = readVarUint(bytes, offset);
    offset = itemIndex.offset;
    exports.push({ name: exportName.value, kind: wasmExternalKind(kind), index: itemIndex.value });
  }
  return exports;
}
function skipWasmImportDescriptor(bytes, offset, end, kind) {
  if (kind === 0) {
    return readVarUint(bytes, offset).offset;
  }
  if (kind === 1) {
    const elementTypeOffset = offset + 1;
    return skipWasmLimits(bytes, elementTypeOffset, end);
  }
  if (kind === 2) {
    return skipWasmLimits(bytes, offset, end);
  }
  if (kind === 3) {
    return Math.min(end, offset + 2);
  }
  return offset;
}
function skipWasmLimits(bytes, offset, end) {
  const flags = bytes[offset++];
  offset = readVarUint(bytes, offset).offset;
  if ((flags & 1) === 1 && offset < end) {
    offset = readVarUint(bytes, offset).offset;
  }
  return offset;
}
function readVarUint(bytes, offset) {
  let result = 0;
  let shift = 0;
  for (let index = 0; index < 5; index++) {
    if (offset >= bytes.length) {
      throw new Error("LEB128 \u6570\u636E\u4E0D\u5B8C\u6574\u3002");
    }
    const byte = bytes[offset++];
    result |= (byte & 127) << shift;
    if ((byte & 128) === 0) {
      return { value: result >>> 0, offset };
    }
    shift += 7;
  }
  throw new Error("LEB128 \u6570\u636E\u8FC7\u957F\u3002");
}
function readWasmName(bytes, offset, end) {
  const length = readVarUint(bytes, offset);
  offset = length.offset;
  const nameEnd = offset + length.value;
  if (nameEnd > end) {
    throw new Error("\u5B57\u7B26\u4E32\u957F\u5EA6\u8D85\u8FC7 section \u8FB9\u754C\u3002");
  }
  return { value: new TextDecoder().decode(bytes.slice(offset, nameEnd)), offset: nameEnd };
}
function wasmSectionName(id) {
  const names = {
    0: "custom",
    1: "type",
    2: "import",
    3: "function",
    4: "table",
    5: "memory",
    6: "global",
    7: "export",
    8: "start",
    9: "element",
    10: "code",
    11: "data",
    12: "data-count"
  };
  return names[id] || `unknown ${id}`;
}
function wasmExternalKind(kind) {
  const names = {
    0: "function",
    1: "table",
    2: "memory",
    3: "global"
  };
  return names[kind] || `unknown ${kind}`;
}
async function createPhotoshopPreview(bytes, toolbar) {
  const preview = document.createElement("div");
  preview.className = "ofv-psd-preview";
  const header = parsePhotoshopHeader(bytes);
  if (!header.valid) {
    const error = document.createElement("p");
    error.className = "ofv-psd-error";
    error.textContent = header.error || "\u4E0D\u662F\u6709\u6548\u7684 Photoshop \u6587\u6863\u5934\u3002";
    preview.append(error);
    return { element: preview };
  }
  const composite = await createPhotoshopCompositePreview(bytes, header, toolbar);
  preview.append(composite.element);
  return { element: preview, instance: composite.instance };
}
async function createPhotoshopCompositePreview(bytes, header, toolbar) {
  const wrapper = document.createElement("div");
  wrapper.className = "ofv-psd-composite";
  if (!canUseBrowserCanvas()) {
    const status = document.createElement("p");
    status.className = "ofv-psd-error";
    status.textContent = "\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301 Canvas\uFF0C\u65E0\u6CD5\u751F\u6210 PSD \u5408\u6210\u56FE\u9884\u89C8\u3002";
    wrapper.append(status);
    return { element: wrapper };
  }
  try {
    const { readPsd } = await import("ag-psd");
    const psd = readPsd(toStandaloneArrayBuffer(bytes), {
      skipLayerImageData: true,
      skipThumbnail: true,
      skipLinkedFilesData: true,
      useImageData: true,
      throwForMissingFeatures: false,
      logMissingFeatures: false
    });
    const canvas = psd.canvas || createCanvasFromPsdImageData(psd);
    if (!canvas) {
      throw new Error("PSD \u6587\u4EF6\u6CA1\u6709\u53EF\u8BFB\u53D6\u7684\u5408\u6210\u56FE\u50CF\u6570\u636E\u3002\u8BF7\u5728 Photoshop \u4E2D\u5F00\u542F\u201C\u6700\u5927\u517C\u5BB9\u6027\u201D\u4FDD\u5B58\uFF0C\u6216\u63A5\u5165\u5916\u90E8\u8F6C\u6362\u670D\u52A1\u3002");
    }
    canvas.classList.add("ofv-psd-canvas");
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", `Photoshop composite ${header.width} x ${header.height}`);
    wrapper.append(canvas);
    return { element: wrapper, instance: createAssetVisualController(canvas, toolbar) };
  } catch (error) {
    const status = document.createElement("p");
    status.className = "ofv-psd-error";
    status.textContent = `PSD \u5408\u6210\u56FE\u89E3\u6790\u5931\u8D25\uFF1A${error instanceof Error ? error.message : "\u5F53\u524D\u6587\u4EF6\u7279\u6027\u6682\u4E0D\u652F\u6301\u3002"}`;
    wrapper.append(status);
  }
  return { element: wrapper };
}
function createAssetVisualController(element, toolbar) {
  let scale = 1;
  let rotation = 0;
  const apply = () => {
    element.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    element.style.transformOrigin = "center";
    toolbar?.setZoom(scale);
  };
  apply();
  return {
    canCommand(command) {
      return command === "zoom-in" || command === "zoom-out" || command === "zoom-reset" || command === "rotate-right" || command === "rotate-left";
    },
    command(command) {
      if (command === "zoom-in") {
        scale = Math.min(8, Number((scale + 0.25).toFixed(2)));
        apply();
        return true;
      }
      if (command === "zoom-out") {
        scale = Math.max(0.1, Number((scale - 0.25).toFixed(2)));
        apply();
        return true;
      }
      if (command === "zoom-reset") {
        scale = 1;
        rotation = 0;
        apply();
        return true;
      }
      if (command === "rotate-right") {
        rotation += 90;
        apply();
        return true;
      }
      if (command === "rotate-left") {
        rotation -= 90;
        apply();
        return true;
      }
      return false;
    },
    destroy() {
      element.style.removeProperty("transform");
      element.style.removeProperty("transform-origin");
      toolbar?.setZoom(void 0);
    }
  };
}
function canUseBrowserCanvas() {
  return typeof document !== "undefined" && typeof HTMLCanvasElement !== "undefined";
}
function toStandaloneArrayBuffer(bytes) {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}
function createCanvasFromPsdImageData(psd) {
  const imageData = psd.imageData;
  if (!imageData || !imageData.width || !imageData.height || !(imageData.data instanceof Uint8ClampedArray)) {
    return void 0;
  }
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const context = canvas.getContext("2d");
  if (!context) {
    return void 0;
  }
  context.putImageData(new ImageData(new Uint8ClampedArray(imageData.data), imageData.width, imageData.height), 0, 0);
  return canvas;
}
function parsePhotoshopHeader(bytes) {
  if (bytes.length < 26) {
    return { valid: false, error: "\u6587\u4EF6\u592A\u77ED\uFF0C\u65E0\u6CD5\u8BFB\u53D6 PSD/PSB \u5934\u4FE1\u606F\u3002" };
  }
  const signature = new TextDecoder("ascii").decode(bytes.slice(0, 4));
  if (signature !== "8BPS") {
    return { valid: false, signature, error: "\u7F3A\u5C11 8BPS Photoshop \u7B7E\u540D\u3002" };
  }
  const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const version = view3.getUint16(4, false);
  if (version !== 1 && version !== 2) {
    return { valid: false, signature, version, error: `\u672A\u77E5 Photoshop \u6587\u4EF6\u7248\u672C\uFF1A${version}\u3002` };
  }
  const reserved = bytes.slice(6, 12);
  if (reserved.some((byte) => byte !== 0)) {
    return { valid: false, signature, version, error: "PSD/PSB \u4FDD\u7559\u5B57\u6BB5\u4E0D\u4E3A 0\uFF0C\u6587\u4EF6\u5934\u53EF\u80FD\u5DF2\u635F\u574F\u3002" };
  }
  return {
    valid: true,
    signature,
    version,
    channels: view3.getUint16(12, false),
    height: view3.getUint32(14, false),
    width: view3.getUint32(18, false),
    depth: view3.getUint16(22, false),
    colorMode: view3.getUint16(24, false)
  };
}
function createSqlitePreview(bytes) {
  const preview = document.createElement("div");
  preview.className = "ofv-sqlite-preview";
  const heading = document.createElement("strong");
  heading.textContent = "SQLite \u7ED3\u6784";
  preview.append(heading);
  const header = parseSqliteHeader(bytes);
  if (!header.valid) {
    const error = document.createElement("p");
    error.className = "ofv-sqlite-error";
    error.textContent = header.error || "\u4E0D\u662F\u6709\u6548\u7684 SQLite \u6570\u636E\u5E93\u6587\u4EF6\u3002";
    preview.append(error);
    return preview;
  }
  hideSupplementalInfo8(heading);
  const summary = document.createElement("div");
  summary.className = "ofv-sqlite-summary";
  appendMeta(summary, "\u9875\u5927\u5C0F", `${header.pageSize} B`);
  appendMeta(summary, "\u9875\u6570", header.pageCount ?? "\u672A\u77E5");
  appendMeta(summary, "\u8BFB\u5199\u7248\u672C", `${sqliteJournalMode(header.readVersion)} / ${sqliteJournalMode(header.writeVersion)}`);
  appendMeta(summary, "Schema", header.schemaVersion ?? "\u672A\u77E5");
  appendMeta(summary, "\u7F16\u7801", sqliteEncoding(header.textEncoding));
  appendMeta(summary, "User version", header.userVersion ?? 0);
  hideSupplementalInfo8(summary);
  preview.append(summary);
  const schema = parseSqliteSchema(bytes, header);
  if (schema.length > 0) {
    preview.append(createSqliteSchemaTable(schema));
    const samples = createSqliteTableSamples(bytes, header, schema);
    if (samples.length > 0) {
      preview.append(createSqliteDataPreview(samples));
    }
  } else {
    const empty = document.createElement("p");
    empty.className = "ofv-sqlite-empty";
    empty.textContent = "\u672A\u4ECE\u7B2C\u4E00\u9875 sqlite_schema \u53F6\u5B50\u9875\u63D0\u53D6\u5230\u7ED3\u6784\u5B9A\u4E49\uFF1B\u590D\u6742\u6570\u636E\u5E93\u53EF\u540E\u7EED\u63A5\u5165 sqlite-wasm \u5B8C\u6574\u8BFB\u53D6\u3002";
    preview.append(empty);
  }
  return preview;
}
function createSqliteTableSamples(bytes, header, schema) {
  return schema.filter((entry) => entry.type === "table" && entry.rootPage > 0 && !entry.name.startsWith("sqlite_")).slice(0, 6).map((entry) => parseSqliteTableSample(bytes, header, entry)).filter((sample) => Boolean(sample && (sample.rows.length > 0 || sample.note)));
}
function parseSqliteTableSample(bytes, header, entry) {
  const pageSize = header.pageSize || 0;
  const pageIndex = entry.rootPage - 1;
  const pageStart = pageIndex * pageSize;
  if (pageSize <= 0 || pageStart < 0 || pageStart >= bytes.length) {
    return null;
  }
  const pageHeader = pageStart + (entry.rootPage === 1 ? 100 : 0);
  if (pageHeader + 8 > bytes.length) {
    return null;
  }
  const columns = parseSqliteCreateTableColumns(entry.sql);
  if (columns.length === 0) {
    return null;
  }
  if (bytes[pageHeader] !== 13) {
    return {
      tableName: entry.name,
      rootPage: entry.rootPage,
      columns,
      rows: [],
      note: "\u5F53\u524D\u53EA\u5185\u7F6E\u89E3\u6790 SQLite table leaf page\uFF1B\u7D22\u5F15\u9875\u3001\u6EA2\u51FA\u9875\u6216\u590D\u6742 b-tree \u53EF\u63A5\u5165 sqlite-wasm \u589E\u5F3A\u3002"
    };
  }
  const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const cellCount = view3.getUint16(pageHeader + 3, false);
  const rows = [];
  const pageEnd = Math.min(bytes.length, pageStart + pageSize);
  for (let index = 0; index < Math.min(cellCount, 80); index++) {
    const pointerOffset = pageHeader + 8 + index * 2;
    if (pointerOffset + 2 > pageEnd) {
      break;
    }
    const cellOffset = pageStart + view3.getUint16(pointerOffset, false);
    const row = parseSqliteTableCell(bytes, cellOffset, pageEnd, columns);
    if (row) {
      rows.push(row);
    }
  }
  return {
    tableName: entry.name,
    rootPage: entry.rootPage,
    columns,
    rows,
    note: rows.length === 0 ? "\u672A\u4ECE\u8BE5\u8868 root page \u62BD\u6837\u5230\u884C\u6570\u636E\u3002" : void 0
  };
}
function parseSqliteTableCell(bytes, offset, pageEnd, columns) {
  try {
    let cursor = offset;
    const payloadLength = readSqliteVarint(bytes, cursor);
    cursor = payloadLength.offset;
    const rowId = readSqliteVarint(bytes, cursor);
    cursor = rowId.offset;
    const payloadEnd = Math.min(pageEnd, cursor + Number(payloadLength.value));
    if (payloadEnd > bytes.length) {
      return null;
    }
    const record = parseSqliteRecord(bytes, cursor, payloadEnd);
    return columns.map((column, index) => {
      const value = record[index] ?? null;
      return value === null && column.primaryKey && /int/i.test(column.type) ? Number(rowId.value) : value;
    });
  } catch {
    return null;
  }
}
function parseSqliteCreateTableColumns(sql) {
  const start = sql.indexOf("(");
  const end = sql.lastIndexOf(")");
  if (start < 0 || end <= start) {
    return [];
  }
  return splitSqliteColumnDefinitions(sql.slice(start + 1, end)).map(parseSqliteColumnDefinition).filter((column) => Boolean(column));
}
function splitSqliteColumnDefinitions(value) {
  const result = [];
  let current = "";
  let depth = 0;
  let quote = "";
  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    if (quote) {
      current += char;
      if (char === quote && value[index + 1] === quote) {
        current += value[++index];
      } else if (char === quote) {
        quote = "";
      }
      continue;
    }
    if (char === "'" || char === '"' || char === "`") {
      quote = char;
      current += char;
      continue;
    }
    if (char === "[") {
      quote = "]";
      current += char;
      continue;
    }
    if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth = Math.max(0, depth - 1);
    }
    if (char === "," && depth === 0) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    result.push(current.trim());
  }
  return result;
}
function parseSqliteColumnDefinition(definition) {
  if (/^(?:constraint|primary|foreign|unique|check|key)\b/i.test(definition)) {
    return null;
  }
  const match = definition.match(/^("[^"]+"|'[^']+'|`[^`]+`|\[[^\]]+\]|\S+)(?:\s+(.+))?$/);
  if (!match) {
    return null;
  }
  const name = unquoteSqliteIdentifier(match[1]);
  const rest = match[2] || "";
  const typeMatch = rest.match(/^([a-z0-9_]+(?:\s+[a-z0-9_]+)?)/i);
  return {
    name,
    type: typeMatch?.[1]?.toUpperCase() || "ANY",
    primaryKey: /\bprimary\s+key\b/i.test(rest)
  };
}
function unquoteSqliteIdentifier(value) {
  if (value.startsWith('"') && value.endsWith('"') || value.startsWith("'") && value.endsWith("'") || value.startsWith("`") && value.endsWith("`")) {
    return value.slice(1, -1).replaceAll(value[0] + value[0], value[0]);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    return value.slice(1, -1);
  }
  return value;
}
function parseSqliteHeader(bytes) {
  if (bytes.length < 100) {
    return { valid: false, error: "\u6587\u4EF6\u592A\u77ED\uFF0C\u65E0\u6CD5\u8BFB\u53D6 SQLite \u6570\u636E\u5E93\u5934\u3002" };
  }
  const signature = new TextDecoder("ascii").decode(bytes.slice(0, 16));
  if (signature !== "SQLite format 3\0") {
    return { valid: false, error: "\u7F3A\u5C11 SQLite format 3 \u6587\u4EF6\u7B7E\u540D\u3002" };
  }
  const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const rawPageSize = view3.getUint16(16, false);
  const pageSize = rawPageSize === 1 ? 65536 : rawPageSize;
  if (pageSize < 512 || pageSize > 65536 || (pageSize & pageSize - 1) !== 0) {
    return { valid: false, error: `SQLite \u9875\u5927\u5C0F\u65E0\u6548\uFF1A${pageSize}\u3002` };
  }
  return {
    valid: true,
    pageSize,
    writeVersion: bytes[18],
    readVersion: bytes[19],
    pageCount: view3.getUint32(28, false),
    schemaVersion: view3.getUint32(40, false),
    textEncoding: view3.getUint32(56, false),
    userVersion: view3.getUint32(60, false)
  };
}
function parseSqliteSchema(bytes, header) {
  const pageSize = header.pageSize || 0;
  if (pageSize <= 0 || bytes.length < Math.min(pageSize, 100)) {
    return [];
  }
  const pageStart = 0;
  const btreeStart = 100;
  if (bytes[btreeStart] !== 13) {
    return [];
  }
  const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const cellCount = view3.getUint16(btreeStart + 3, false);
  const entries = [];
  for (let index = 0; index < Math.min(cellCount, 80); index++) {
    const pointerOffset = btreeStart + 8 + index * 2;
    if (pointerOffset + 2 > bytes.length) {
      break;
    }
    const cellOffset = pageStart + view3.getUint16(pointerOffset, false);
    const entry = parseSqliteSchemaCell(bytes, cellOffset, pageStart + pageSize);
    if (entry) {
      entries.push(entry);
    }
  }
  return entries;
}
function parseSqliteSchemaCell(bytes, offset, pageEnd) {
  try {
    let cursor = offset;
    const payloadLength = readSqliteVarint(bytes, cursor);
    cursor = payloadLength.offset;
    const rowId = readSqliteVarint(bytes, cursor);
    cursor = rowId.offset;
    const payloadEnd = Math.min(pageEnd, cursor + Number(payloadLength.value));
    if (payloadEnd > bytes.length) {
      return null;
    }
    const record = parseSqliteRecord(bytes, cursor, payloadEnd);
    if (record.length < 5) {
      return null;
    }
    return {
      type: String(record[0] ?? ""),
      name: String(record[1] ?? ""),
      tableName: String(record[2] ?? ""),
      rootPage: Number(record[3] ?? 0),
      sql: String(record[4] ?? "")
    };
  } catch {
    return null;
  }
}
function parseSqliteRecord(bytes, offset, end) {
  const headerSize = readSqliteVarint(bytes, offset);
  let headerCursor = headerSize.offset;
  const bodyStart = offset + Number(headerSize.value);
  let bodyCursor = bodyStart;
  const serialTypes = [];
  while (headerCursor < bodyStart && headerCursor < end) {
    const serial = readSqliteVarint(bytes, headerCursor);
    serialTypes.push(serial.value);
    headerCursor = serial.offset;
  }
  return serialTypes.map((serialType) => {
    const value = readSqliteValue(bytes, bodyCursor, end, serialType);
    bodyCursor = value.offset;
    return value.value;
  });
}
function readSqliteValue(bytes, offset, end, serialType) {
  const type = Number(serialType);
  if (type === 0) {
    return { value: null, offset };
  }
  if (type === 1) {
    return { value: signedInteger(bytes, offset, 1), offset: offset + 1 };
  }
  if (type === 2) {
    return { value: signedInteger(bytes, offset, 2), offset: offset + 2 };
  }
  if (type === 3) {
    return { value: signedInteger(bytes, offset, 3), offset: offset + 3 };
  }
  if (type === 4) {
    return { value: signedInteger(bytes, offset, 4), offset: offset + 4 };
  }
  if (type === 5) {
    return { value: signedInteger(bytes, offset, 6), offset: offset + 6 };
  }
  if (type === 6) {
    return { value: signedInteger(bytes, offset, 8), offset: offset + 8 };
  }
  if (type === 8) {
    return { value: 0, offset };
  }
  if (type === 9) {
    return { value: 1, offset };
  }
  if (type >= 12) {
    const length = Math.floor((type - 12) / 2);
    const valueEnd = Math.min(end, offset + length);
    if (type % 2 === 1) {
      return { value: new TextDecoder().decode(bytes.slice(offset, valueEnd)), offset: offset + length };
    }
    return { value: `<blob ${length} B>`, offset: offset + length };
  }
  return { value: null, offset };
}
function readSqliteVarint(bytes, offset) {
  let value = 0n;
  for (let index = 0; index < 9; index++) {
    if (offset >= bytes.length) {
      throw new Error("SQLite varint \u6570\u636E\u4E0D\u5B8C\u6574\u3002");
    }
    const byte = bytes[offset++];
    if (index === 8) {
      value = value << 8n | BigInt(byte);
      return { value, offset };
    }
    value = value << 7n | BigInt(byte & 127);
    if ((byte & 128) === 0) {
      return { value, offset };
    }
  }
  return { value, offset };
}
function signedInteger(bytes, offset, length) {
  let value = 0n;
  for (let index = 0; index < length; index++) {
    value = value << 8n | BigInt(bytes[offset + index] || 0);
  }
  const bits = BigInt(length * 8);
  const signBit = 1n << bits - 1n;
  if ((value & signBit) !== 0n) {
    value -= 1n << bits;
  }
  return Number(value);
}
function createSqliteSchemaTable(entries) {
  const wrapper = document.createElement("div");
  wrapper.className = "ofv-sqlite-schema";
  const title = document.createElement("strong");
  title.textContent = `Schema \u5BF9\u8C61 ${entries.length}`;
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const header = document.createElement("tr");
  for (const label of ["\u7C7B\u578B", "\u540D\u79F0", "\u8868", "Root", "SQL"]) {
    const th = document.createElement("th");
    th.textContent = label;
    header.append(th);
  }
  thead.append(header);
  const tbody = document.createElement("tbody");
  for (const entry of entries) {
    const row = document.createElement("tr");
    for (const value of [entry.type, entry.name, entry.tableName, String(entry.rootPage), entry.sql]) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    }
    tbody.append(row);
  }
  table.append(thead, tbody);
  wrapper.append(title, table);
  return wrapper;
}
function createSqliteDataPreview(samples) {
  const wrapper = document.createElement("div");
  wrapper.className = "ofv-sqlite-data";
  const title = document.createElement("strong");
  title.textContent = "\u8868\u6570\u636E\u62BD\u6837";
  wrapper.append(title);
  for (const sample of samples) {
    const details = document.createElement("details");
    details.className = "ofv-sqlite-table-sample";
    details.open = true;
    const summary = document.createElement("summary");
    summary.textContent = `${sample.tableName} \xB7 root ${sample.rootPage} \xB7 ${sample.rows.length} \u884C`;
    details.append(summary);
    if (sample.note) {
      const note = document.createElement("p");
      note.className = "ofv-sqlite-empty";
      note.textContent = sample.note;
      details.append(note);
    }
    if (sample.rows.length > 0) {
      const scroller = document.createElement("div");
      scroller.className = "ofv-sqlite-data-table";
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const headRow = document.createElement("tr");
      for (const column of sample.columns) {
        const th = document.createElement("th");
        th.textContent = column.name;
        if (column.type) {
          th.title = column.primaryKey ? `${column.type} PRIMARY KEY` : column.type;
        }
        headRow.append(th);
      }
      thead.append(headRow);
      const tbody = document.createElement("tbody");
      for (const row of sample.rows) {
        const tr = document.createElement("tr");
        for (const value of row) {
          const td = document.createElement("td");
          td.textContent = value === null ? "NULL" : String(value);
          tr.append(td);
        }
        tbody.append(tr);
      }
      table.append(thead, tbody);
      scroller.append(table);
      details.append(scroller);
    }
    wrapper.append(details);
  }
  return wrapper;
}
function sqliteJournalMode(value) {
  if (value === 1) {
    return "rollback";
  }
  if (value === 2) {
    return "WAL";
  }
  return value === void 0 ? "\u672A\u77E5" : String(value);
}
function sqliteEncoding(value) {
  const encodings = {
    0: "\u672A\u58F0\u660E",
    1: "UTF-8",
    2: "UTF-16le",
    3: "UTF-16be"
  };
  return value === void 0 ? "\u672A\u77E5" : encodings[value] || `\u672A\u77E5 (${value})`;
}
function createParquetPreview(bytes) {
  const preview = document.createElement("div");
  preview.className = "ofv-data-preview";
  const heading = document.createElement("strong");
  heading.textContent = "Parquet \u7ED3\u6784";
  preview.append(heading);
  const parsed = parseParquet(bytes);
  if (!parsed.valid) {
    const error = document.createElement("p");
    error.className = "ofv-data-error";
    error.textContent = parsed.error || "\u4E0D\u662F\u6709\u6548\u7684 Parquet \u6587\u4EF6\u3002";
    preview.append(error);
    return preview;
  }
  const summary = document.createElement("div");
  summary.className = "ofv-data-summary";
  appendMeta(summary, "Magic", "PAR1");
  appendMeta(summary, "Footer", `${parsed.footerLength} B`);
  appendMeta(summary, "Footer offset", `0x${(parsed.footerOffset || 0).toString(16).toUpperCase()}`);
  appendMeta(summary, "\u6570\u636E\u533A", formatBytes4(parsed.dataBytes || 0));
  hideSupplementalInfo8(summary);
  preview.append(summary);
  const note = document.createElement("p");
  note.className = "ofv-data-note";
  note.textContent = "Parquet footer \u4F7F\u7528 Thrift \u7F16\u7801\uFF1B\u6B63\u5728\u5C1D\u8BD5\u5728\u6D4F\u89C8\u5668\u7AEF\u89E3\u6790 schema\u3001row group \u548C\u524D\u51E0\u884C\u6570\u636E\u3002";
  hideSupplementalInfo8(note);
  preview.append(note);
  void appendParquetDecodedPreview(preview, bytes, note, heading);
  return preview;
}
async function appendParquetDecodedPreview(preview, bytes, note, heading) {
  try {
    const { parquetMetadataAsync, parquetReadObjects, parquetSchema } = await import("hyparquet");
    const file = arrayBufferLike(bytes);
    const metadata = await parquetMetadataAsync(file, { initialFetchSize: Math.min(bytes.byteLength, 512 * 1024) });
    const schema = parquetSchema(metadata);
    const fields = flattenParquetSchema(schema);
    const rows = await parquetReadObjects({
      file,
      metadata,
      rowFormat: "object",
      rowStart: 0,
      rowEnd: Math.min(20, Number(metadata.num_rows || 0n))
    });
    note.textContent = `\u5DF2\u4F7F\u7528 hyparquet \u5728\u524D\u7AEF\u89E3\u6790 schema\u3001${metadata.row_groups.length} \u4E2A row group \u548C ${rows.length} \u884C\u62BD\u6837\u6570\u636E\u3002`;
    if (rows.length > 0) {
      hideSupplementalInfo8(heading);
      const schemaTable = createParquetSchemaTable(fields, metadata);
      hideSupplementalInfo8(schemaTable);
      preview.append(schemaTable);
      preview.append(createObjectRowsTable("\u8BB0\u5F55\u62BD\u6837", rows));
    } else {
      preview.append(createParquetSchemaTable(fields, metadata));
    }
  } catch (error) {
    note.textContent = `\u5DF2\u5C55\u793A Parquet \u5BB9\u5668\u8FB9\u754C\uFF1Bschema/\u8BB0\u5F55\u89E3\u6790\u5931\u8D25\uFF1A${error instanceof Error ? error.message : "\u5F53\u524D\u7F16\u7801\u6216\u538B\u7F29\u65B9\u5F0F\u6682\u4E0D\u652F\u6301\u3002"}`;
  }
}
function arrayBufferLike(bytes) {
  return {
    byteLength: bytes.byteLength,
    slice(start, end) {
      return bytes.buffer.slice(bytes.byteOffset + start, bytes.byteOffset + (end ?? bytes.byteLength));
    }
  };
}
function flattenParquetSchema(schema) {
  const fields = [];
  const visit = (node) => {
    const path = Array.isArray(node.path) && node.path.length > 0 ? node.path.join(".") : node.element?.name || "";
    if (node.element && path) {
      fields.push({
        name: path,
        type: node.element.type || (node.children?.length ? "group" : "-"),
        repetition: node.element.repetition_type || "-",
        logical: node.element.logical_type?.type || node.element.converted_type || "-"
      });
    }
    for (const child of node.children || []) {
      visit(child);
    }
  };
  for (const child of schema.children || []) {
    visit(child);
  }
  return fields;
}
function createParquetSchemaTable(fields, metadata) {
  const wrapper = document.createElement("div");
  wrapper.className = "ofv-parquet-schema";
  const title = document.createElement("strong");
  title.textContent = "Schema";
  const summary = document.createElement("div");
  summary.className = "ofv-data-summary";
  appendMeta(summary, "Rows", String(metadata.num_rows));
  appendMeta(summary, "Row groups", metadata.row_groups.length);
  appendMeta(summary, "Columns", fields.filter((field) => field.type !== "group").length);
  if (metadata.created_by) {
    appendMeta(summary, "Created by", metadata.created_by);
  }
  hideSupplementalInfo8(summary);
  const table = document.createElement("table");
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const label of ["Name", "Type", "Repetition", "Logical"]) {
    const th = document.createElement("th");
    th.textContent = label;
    headRow.append(th);
  }
  head.append(headRow);
  const body = document.createElement("tbody");
  for (const field of fields.slice(0, 120)) {
    const row = document.createElement("tr");
    for (const value of [field.name, field.type, field.repetition, field.logical]) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    }
    body.append(row);
  }
  table.append(head, body);
  wrapper.append(title, summary, table);
  return wrapper;
}
function createObjectRowsTable(titleText, rows) {
  const wrapper = document.createElement("div");
  wrapper.className = "ofv-parquet-records";
  const title = document.createElement("strong");
  title.textContent = `${titleText} ${rows.length}`;
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))].slice(0, 40);
  const table = document.createElement("table");
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const column of columns) {
    const th = document.createElement("th");
    th.textContent = column;
    headRow.append(th);
  }
  head.append(headRow);
  const body = document.createElement("tbody");
  for (const item of rows) {
    const row = document.createElement("tr");
    for (const column of columns) {
      const cell = document.createElement("td");
      cell.textContent = formatPreviewValue(item[column]);
      row.append(cell);
    }
    body.append(row);
  }
  table.append(head, body);
  wrapper.append(title, table);
  return wrapper;
}
function formatPreviewValue(value) {
  if (value === null || value === void 0) {
    return "";
  }
  if (typeof value === "bigint") {
    return value.toString();
  }
  if (value instanceof Uint8Array) {
    return `Uint8Array(${value.byteLength})`;
  }
  if (value instanceof Date) {
    return value.toISOString();
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return Object.prototype.toString.call(value);
    }
  }
  return String(value);
}
function parseParquet(bytes) {
  if (bytes.length < 12) {
    return { valid: false, error: "\u6587\u4EF6\u592A\u77ED\uFF0C\u65E0\u6CD5\u8BFB\u53D6 Parquet \u5934\u5C3E\u4FE1\u606F\u3002" };
  }
  if (asciiAt4(bytes, 0, 4) !== "PAR1" || asciiAt4(bytes, bytes.length - 4, 4) !== "PAR1") {
    return { valid: false, error: "\u7F3A\u5C11 Parquet PAR1 magic header/footer\u3002" };
  }
  const view3 = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const footerLength = view3.getUint32(bytes.length - 8, true);
  const footerOffset = bytes.length - 8 - footerLength;
  if (footerOffset < 4) {
    return { valid: false, error: "Parquet footer \u957F\u5EA6\u8D85\u8FC7\u6587\u4EF6\u8FB9\u754C\u3002" };
  }
  return {
    valid: true,
    footerLength,
    footerOffset,
    dataBytes: Math.max(0, footerOffset - 4)
  };
}
function createAvroPreview(bytes) {
  const preview = document.createElement("div");
  preview.className = "ofv-data-preview";
  const heading = document.createElement("strong");
  heading.textContent = "Avro \u7ED3\u6784";
  preview.append(heading);
  const parsed = parseAvro(bytes);
  if (!parsed.valid) {
    const error = document.createElement("p");
    error.className = "ofv-data-error";
    error.textContent = parsed.error || "\u4E0D\u662F\u6709\u6548\u7684 Avro Object Container \u6587\u4EF6\u3002";
    preview.append(error);
    return preview;
  }
  const summary = document.createElement("div");
  summary.className = "ofv-data-summary";
  appendMeta(summary, "Magic", "Obj\\x01");
  appendMeta(summary, "Codec", parsed.codec || "null");
  appendMeta(summary, "Metadata", parsed.metadata.length);
  appendMeta(summary, "Sync marker", parsed.syncMarker || "\u672A\u77E5");
  hideSupplementalInfo8(summary);
  preview.append(summary);
  const hasRecordRows = Boolean(parsed.records && parsed.records.rows.length > 0);
  if (hasRecordRows) {
    hideSupplementalInfo8(heading);
  }
  if (parsed.schema) {
    const schema = document.createElement("div");
    schema.className = "ofv-avro-schema";
    const title = document.createElement("strong");
    title.textContent = "Schema";
    const meta = document.createElement("div");
    meta.className = "ofv-data-summary";
    appendMeta(meta, "\u7C7B\u578B", parsed.schema.type || "\u672A\u77E5");
    appendMeta(meta, "\u540D\u79F0", [parsed.schema.namespace, parsed.schema.name].filter(Boolean).join(".") || "\u672A\u77E5");
    appendMeta(meta, "\u5B57\u6BB5", parsed.schema.fields.length);
    hideSupplementalInfo8(meta);
    schema.append(title, meta);
    if (parsed.schema.fields.length > 0) {
      const list = document.createElement("ul");
      for (const field of parsed.schema.fields.slice(0, 80)) {
        const item = document.createElement("li");
        item.textContent = field;
        list.append(item);
      }
      schema.append(list);
    }
    if (hasRecordRows) {
      hideSupplementalInfo8(schema);
    }
    preview.append(schema);
  }
  if (parsed.records && (parsed.records.rows.length > 0 || parsed.records.note)) {
    preview.append(createAvroRecordPreview(parsed.records));
  }
  if (parsed.metadata.length > 0) {
    const metadata = createKeyValueTable("Metadata", parsed.metadata);
    if (parsed.schema || hasRecordRows) {
      hideSupplementalInfo8(metadata);
    }
    preview.append(metadata);
  }
  return preview;
}
function parseAvro(bytes) {
  if (bytes.length < 4 || bytes[0] !== 79 || bytes[1] !== 98 || bytes[2] !== 106 || bytes[3] !== 1) {
    return { valid: false, error: "\u7F3A\u5C11 Avro Object Container magic header\u3002", metadata: [] };
  }
  let offset = 4;
  const metadata = [];
  try {
    while (true) {
      const blockCount = readAvroLong(bytes, offset);
      offset = blockCount.offset;
      let count = blockCount.value;
      if (count === 0n) {
        break;
      }
      if (count < 0n) {
        count = -count;
        const blockSize = readAvroLong(bytes, offset);
        offset = blockSize.offset;
      }
      for (let index = 0; index < Number(count); index++) {
        const key = readAvroBytes(bytes, offset);
        offset = key.offset;
        const value = readAvroBytes(bytes, offset);
        offset = value.offset;
        metadata.push({
          key: new TextDecoder().decode(key.value),
          value: decodeAvroMetadataValue(key.value, value.value)
        });
      }
    }
    if (offset + 16 > bytes.length) {
      throw new Error("Avro sync marker \u7F3A\u5931\u3002");
    }
    const syncMarkerBytes = bytes.slice(offset, offset + 16);
    const syncMarker = Array.from(syncMarkerBytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
    const schemaText = metadata.find((item) => item.key === "avro.schema")?.value;
    const codec = metadata.find((item) => item.key === "avro.codec")?.value;
    const schema = schemaText ? summarizeAvroSchema(schemaText) : void 0;
    return {
      valid: true,
      metadata,
      codec,
      syncMarker,
      schema,
      records: schemaText ? parseAvroRecordSamples(bytes, offset + 16, syncMarkerBytes, schemaText, codec) : void 0
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Avro metadata \u89E3\u6790\u5931\u8D25\u3002",
      metadata
    };
  }
}
function readAvroLong(bytes, offset) {
  let result = 0n;
  let shift = 0n;
  for (let index = 0; index < 10; index++) {
    if (offset >= bytes.length) {
      throw new Error("Avro long \u6570\u636E\u4E0D\u5B8C\u6574\u3002");
    }
    const byte = bytes[offset++];
    result |= BigInt(byte & 127) << shift;
    if ((byte & 128) === 0) {
      const value = result >> 1n ^ -(result & 1n);
      return { value, offset };
    }
    shift += 7n;
  }
  throw new Error("Avro long \u6570\u636E\u8FC7\u957F\u3002");
}
function readAvroBytes(bytes, offset) {
  const length = readAvroLong(bytes, offset);
  offset = length.offset;
  if (length.value < 0n) {
    throw new Error("Avro bytes \u957F\u5EA6\u65E0\u6548\u3002");
  }
  const size = Number(length.value);
  const end = offset + size;
  if (end > bytes.length) {
    throw new Error("Avro bytes \u8D85\u51FA\u6587\u4EF6\u8FB9\u754C\u3002");
  }
  return { value: bytes.slice(offset, end), offset: end };
}
function decodeAvroMetadataValue(keyBytes, valueBytes) {
  const key = new TextDecoder().decode(keyBytes);
  if (key === "avro.schema" || key === "avro.codec" || /^[a-z0-9_.-]+$/i.test(key)) {
    return new TextDecoder().decode(valueBytes);
  }
  return `<${valueBytes.length} B>`;
}
function summarizeAvroSchema(schemaText) {
  try {
    const schema = JSON.parse(schemaText);
    const fieldSchemas = Array.isArray(schema.fields) ? schema.fields.filter((field) => typeof field.name === "string").map((field) => ({
      name: field.name,
      type: field.type,
      label: `${field.name}: ${formatAvroType(field.type)}`
    })) : [];
    return {
      type: typeof schema.type === "string" ? schema.type : void 0,
      name: typeof schema.name === "string" ? schema.name : void 0,
      namespace: typeof schema.namespace === "string" ? schema.namespace : void 0,
      fields: fieldSchemas.map((field) => field.label),
      fieldSchemas
    };
  } catch {
    return { fields: [], fieldSchemas: [] };
  }
}
function parseAvroRecordSamples(bytes, offset, syncMarker, schemaText, codec) {
  if (codec && codec !== "null") {
    return { fields: [], rows: [], note: `\u5F53\u524D\u5185\u7F6E\u62BD\u6837\u53EA\u652F\u6301 null codec\uFF1B\u8BE5\u6587\u4EF6\u4F7F\u7528 ${codec} \u538B\u7F29\u3002` };
  }
  const schema = summarizeAvroSchema(schemaText);
  const fields = schema?.fieldSchemas || [];
  if (!schema || schema.type !== "record" || fields.length === 0) {
    return void 0;
  }
  const rows = [];
  try {
    while (offset < bytes.length && rows.length < 80) {
      const countInfo = readAvroLong(bytes, offset);
      offset = countInfo.offset;
      if (countInfo.value === 0n) {
        break;
      }
      const blockSizeInfo = readAvroLong(bytes, offset);
      offset = blockSizeInfo.offset;
      const count = Number(countInfo.value < 0n ? -countInfo.value : countInfo.value);
      const blockSize = Number(blockSizeInfo.value);
      const blockEnd = offset + blockSize;
      if (!Number.isFinite(count) || !Number.isFinite(blockSize) || blockSize < 0 || blockEnd > bytes.length) {
        throw new Error("Avro data block \u8D85\u51FA\u6587\u4EF6\u8FB9\u754C\u3002");
      }
      for (let index = 0; index < count && offset < blockEnd && rows.length < 80; index++) {
        const decoded = readAvroRecord(bytes, offset, blockEnd, fields);
        offset = decoded.offset;
        rows.push(decoded.row);
      }
      offset = blockEnd;
      if (offset + syncMarker.length <= bytes.length && matchesBytes(bytes, offset, syncMarker)) {
        offset += syncMarker.length;
      }
    }
  } catch (error) {
    return {
      fields: fields.map((field) => field.name),
      rows,
      note: rows.length > 0 ? `\u5DF2\u62BD\u6837\u90E8\u5206\u8BB0\u5F55\uFF0C\u540E\u7EED\u6570\u636E\u89E3\u6790\u5931\u8D25\uFF1A${error instanceof Error ? error.message : "\u672A\u77E5\u9519\u8BEF"}` : `\u8BB0\u5F55\u62BD\u6837\u5931\u8D25\uFF1A${error instanceof Error ? error.message : "\u5F53\u524D schema \u6682\u4E0D\u652F\u6301"}`
    };
  }
  return rows.length > 0 ? { fields: fields.map((field) => field.name), rows } : void 0;
}
function readAvroRecord(bytes, offset, end, fields) {
  const row = [];
  for (const field of fields) {
    const value = readAvroDatum(bytes, offset, end, field.type);
    row.push(value.value);
    offset = value.offset;
  }
  return { row, offset };
}
function readAvroDatum(bytes, offset, end, type) {
  if (Array.isArray(type)) {
    const branch = readAvroLong(bytes, offset);
    const branchIndex = Number(branch.value);
    const branchType = type[branchIndex];
    if (branchIndex < 0 || branchIndex >= type.length) {
      throw new Error("Avro union \u5206\u652F\u7D22\u5F15\u65E0\u6548\u3002");
    }
    return readAvroDatum(bytes, branch.offset, end, branchType);
  }
  if (type && typeof type === "object") {
    const typed = type;
    return readAvroDatum(bytes, offset, end, typed.type);
  }
  if (type === "null") {
    return { value: null, offset };
  }
  if (type === "boolean") {
    if (offset >= end) {
      throw new Error("Avro boolean \u6570\u636E\u4E0D\u5B8C\u6574\u3002");
    }
    return { value: bytes[offset] !== 0, offset: offset + 1 };
  }
  if (type === "int" || type === "long") {
    const value = readAvroLong(bytes, offset);
    return { value: Number(value.value), offset: value.offset };
  }
  if (type === "float") {
    if (offset + 4 > end) {
      throw new Error("Avro float \u6570\u636E\u4E0D\u5B8C\u6574\u3002");
    }
    return { value: new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getFloat32(offset, true), offset: offset + 4 };
  }
  if (type === "double") {
    if (offset + 8 > end) {
      throw new Error("Avro double \u6570\u636E\u4E0D\u5B8C\u6574\u3002");
    }
    return { value: new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getFloat64(offset, true), offset: offset + 8 };
  }
  if (type === "string") {
    const value = readAvroBytes(bytes, offset);
    if (value.offset > end) {
      throw new Error("Avro string \u8D85\u51FA block \u8FB9\u754C\u3002");
    }
    return { value: new TextDecoder().decode(value.value), offset: value.offset };
  }
  if (type === "bytes") {
    const value = readAvroBytes(bytes, offset);
    if (value.offset > end) {
      throw new Error("Avro bytes \u8D85\u51FA block \u8FB9\u754C\u3002");
    }
    return { value: `<bytes ${value.value.length} B>`, offset: value.offset };
  }
  throw new Error(`\u6682\u4E0D\u652F\u6301 Avro \u5B57\u6BB5\u7C7B\u578B ${formatAvroType(type)}\u3002`);
}
function matchesBytes(bytes, offset, expected) {
  for (let index = 0; index < expected.length; index++) {
    if (bytes[offset + index] !== expected[index]) {
      return false;
    }
  }
  return true;
}
function createAvroRecordPreview(records) {
  const wrapper = document.createElement("div");
  wrapper.className = "ofv-avro-records";
  const title = document.createElement("strong");
  title.textContent = `\u8BB0\u5F55\u62BD\u6837 ${records.rows.length}`;
  wrapper.append(title);
  if (records.note) {
    const note = document.createElement("p");
    note.className = "ofv-data-note";
    note.textContent = records.note;
    wrapper.append(note);
  }
  if (records.rows.length === 0) {
    return wrapper;
  }
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (const field of records.fields) {
    const th = document.createElement("th");
    th.textContent = field;
    headRow.append(th);
  }
  thead.append(headRow);
  const tbody = document.createElement("tbody");
  for (const row of records.rows) {
    const tr = document.createElement("tr");
    for (const value of row) {
      const td = document.createElement("td");
      td.textContent = value === null ? "NULL" : String(value);
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(thead, tbody);
  wrapper.append(table);
  return wrapper;
}
function formatAvroType(type) {
  if (typeof type === "string") {
    return type;
  }
  if (Array.isArray(type)) {
    return type.map(formatAvroType).join(" | ");
  }
  if (type && typeof type === "object") {
    const value = type;
    if (typeof value.name === "string") {
      return value.name;
    }
    if (value.type === "array") {
      return `array<${formatAvroType(value.items)}>`;
    }
    if (value.type === "map") {
      return `map<${formatAvroType(value.values)}>`;
    }
    return formatAvroType(value.type);
  }
  return "unknown";
}
function createKeyValueTable(titleText, rows) {
  const wrapper = document.createElement("div");
  wrapper.className = "ofv-data-kv";
  const title = document.createElement("strong");
  title.textContent = titleText;
  const table = document.createElement("table");
  const tbody = document.createElement("tbody");
  for (const row of rows.slice(0, 80)) {
    const tr = document.createElement("tr");
    const key = document.createElement("th");
    key.textContent = row.key;
    const value = document.createElement("td");
    value.textContent = row.value;
    tr.append(key, value);
    tbody.append(tr);
  }
  table.append(tbody);
  wrapper.append(title, table);
  return wrapper;
}
function createWebArchivePreview(bytes) {
  const preview = document.createElement("div");
  preview.className = "ofv-data-preview ofv-webarchive-preview";
  const heading = document.createElement("strong");
  heading.textContent = "WebArchive \u7ED3\u6784";
  preview.append(heading);
  const parsed = parseWebArchive(bytes);
  if (!parsed.valid) {
    const error = document.createElement("p");
    error.className = "ofv-data-error";
    error.textContent = parsed.error || "\u4E0D\u662F\u6709\u6548\u7684 WebArchive plist\u3002";
    preview.append(error);
    return preview;
  }
  const summary = document.createElement("div");
  summary.className = "ofv-data-summary";
  appendMeta(summary, "\u683C\u5F0F", parsed.binary ? "Binary plist" : "XML plist");
  appendMeta(summary, "\u4E3B\u8D44\u6E90", parsed.url || "\u672A\u58F0\u660E");
  appendMeta(summary, "MIME", parsed.mimeType || "\u672A\u77E5");
  appendMeta(summary, "\u7F16\u7801", parsed.encoding || "\u672A\u58F0\u660E");
  appendMeta(summary, "\u4E3B\u8D44\u6E90\u5927\u5C0F", parsed.mainBytes !== void 0 ? formatBytes4(parsed.mainBytes) : "\u672A\u77E5");
  appendMeta(summary, "\u5B50\u8D44\u6E90", String(parsed.subresources ?? 0));
  appendMeta(summary, "\u5B50\u5F52\u6863", String(parsed.subframeArchives ?? 0));
  hideSupplementalInfo8(summary);
  preview.append(summary);
  if (parsed.binary) {
    const note = document.createElement("p");
    note.className = "ofv-data-note";
    note.textContent = parsed.snippet ? "\u5DF2\u5728\u6D4F\u89C8\u5668\u7AEF\u89E3\u6790 binary plist WebArchive\uFF0C\u5E76\u5C55\u5F00\u4E3B\u8D44\u6E90\u6458\u8981\u3002" : "\u5DF2\u8BC6\u522B binary plist WebArchive\uFF1B\u5F53\u524D\u6587\u4EF6\u672A\u63D0\u53D6\u5230\u53EF\u5C55\u793A\u7684\u4E3B\u8D44\u6E90\u7247\u6BB5\u3002";
    hideSupplementalInfo8(note);
    preview.append(note);
  }
  if (parsed.snippet) {
    hideSupplementalInfo8(heading);
    const snippet = document.createElement("pre");
    snippet.className = "ofv-text-block ofv-webarchive-snippet";
    snippet.textContent = parsed.snippet;
    preview.append(snippet);
  }
  return preview;
}
function parseWebArchive(bytes) {
  if (bytes.length >= 8 && asciiAt4(bytes, 0, 8) === "bplist00") {
    return parseBinaryWebArchive(bytes);
  }
  const text = new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(0, Math.min(bytes.length, 1024 * 1024)));
  if (!/<plist[\s>]/i.test(text) || !text.includes("WebMainResource")) {
    return { valid: false, error: "\u7F3A\u5C11 XML plist \u6216 WebMainResource \u6807\u8BB0\u3002" };
  }
  if (typeof DOMParser === "undefined") {
    return { valid: false, error: "\u5F53\u524D\u73AF\u5883\u7F3A\u5C11 DOMParser\uFF0C\u65E0\u6CD5\u89E3\u6790 XML WebArchive\u3002" };
  }
  const documentXml = new DOMParser().parseFromString(text, "application/xml");
  if (documentXml.querySelector("parsererror")) {
    return { valid: false, error: "XML plist \u89E3\u6790\u5931\u8D25\u3002" };
  }
  const rootDict = Array.from(documentXml.documentElement.children).find((child) => child.tagName === "dict");
  if (!rootDict) {
    return { valid: false, error: "XML plist \u7F3A\u5C11\u6839 dict\u3002" };
  }
  const plist = parsePlistElement(rootDict);
  if (!isPlistDict(plist)) {
    return { valid: false, error: "XML plist \u6839\u8282\u70B9\u4E0D\u662F dict\u3002" };
  }
  return webArchivePreviewFromPlist(plist);
}
function parseBinaryWebArchive(bytes) {
  const plist = parseBinaryPlist(bytes);
  if (!plist.valid) {
    return { valid: true, binary: true, error: plist.error };
  }
  if (!isPlistDict(plist.value)) {
    return { valid: true, binary: true, error: "Binary plist \u6839\u8282\u70B9\u4E0D\u662F dict\u3002" };
  }
  return webArchivePreviewFromPlist(plist.value, true);
}
function webArchivePreviewFromPlist(plist, binary = false) {
  const mainResource = plist.WebMainResource;
  if (!isPlistDict(mainResource)) {
    return { valid: false, binary, error: "WebArchive \u7F3A\u5C11 WebMainResource dict\u3002" };
  }
  const resourceData = mainResource.WebResourceData;
  const mimeType = plistString(mainResource.WebResourceMIMEType);
  const mainBytes = resourceData instanceof Uint8Array ? resourceData.length : void 0;
  return {
    valid: true,
    binary,
    url: plistString(mainResource.WebResourceURL),
    mimeType,
    encoding: plistString(mainResource.WebResourceTextEncodingName),
    mainBytes,
    subresources: Array.isArray(plist.WebSubresources) ? plist.WebSubresources.length : 0,
    subframeArchives: Array.isArray(plist.WebSubframeArchives) ? plist.WebSubframeArchives.length : 0,
    snippet: createWebArchiveSnippet(resourceData, mimeType)
  };
}
function parsePlistElement(element) {
  switch (element.tagName) {
    case "dict": {
      const result = {};
      const children = Array.from(element.children);
      for (let index = 0; index < children.length; index++) {
        const key = children[index];
        if (key.tagName !== "key") {
          continue;
        }
        const value = children[index + 1];
        if (value) {
          result[key.textContent || ""] = parsePlistElement(value);
          index++;
        }
      }
      return result;
    }
    case "array":
      return Array.from(element.children).map(parsePlistElement);
    case "data":
      return decodeBase64Data(element.textContent || "");
    case "integer":
    case "real":
      return Number(element.textContent || 0);
    case "true":
      return true;
    case "false":
      return false;
    case "string":
    case "date":
    default:
      return element.textContent || "";
  }
}
function parseBinaryPlist(bytes) {
  try {
    if (bytes.length < 40 || asciiAt4(bytes, 0, 8) !== "bplist00") {
      return { valid: false, error: "\u7F3A\u5C11 bplist00 \u6587\u4EF6\u5934\u3002" };
    }
    const trailer = bytes.length - 32;
    const offsetIntSize = bytes[trailer + 6];
    const objectRefSize = bytes[trailer + 7];
    const objectCount = readBinaryPlistInt(bytes, trailer + 8, 8);
    const topObject = readBinaryPlistInt(bytes, trailer + 16, 8);
    const offsetTableOffset = readBinaryPlistInt(bytes, trailer + 24, 8);
    if (offsetIntSize <= 0 || objectRefSize <= 0 || objectCount <= 0 || topObject < 0 || topObject >= objectCount || offsetTableOffset + objectCount * offsetIntSize > trailer) {
      return { valid: false, error: "Binary plist trailer \u6216 offset table \u5F02\u5E38\u3002" };
    }
    const offsets = [];
    for (let index = 0; index < objectCount; index++) {
      offsets.push(readBinaryPlistInt(bytes, offsetTableOffset + index * offsetIntSize, offsetIntSize));
    }
    const seen = /* @__PURE__ */ new Set();
    return { valid: true, value: readBinaryPlistObject(bytes, offsets, topObject, objectRefSize, seen) };
  } catch (error) {
    return { valid: false, error: error instanceof Error ? error.message : "Binary plist \u89E3\u6790\u5931\u8D25\u3002" };
  }
}
function readBinaryPlistObject(bytes, offsets, index, objectRefSize, seen) {
  const offset = offsets[index];
  if (offset === void 0 || offset < 0 || offset >= bytes.length) {
    throw new Error(`Binary plist object #${index} \u504F\u79FB\u5F02\u5E38\u3002`);
  }
  if (seen.has(index)) {
    throw new Error(`Binary plist object #${index} \u5B58\u5728\u5FAA\u73AF\u5F15\u7528\u3002`);
  }
  seen.add(index);
  const marker = bytes[offset];
  const type = marker >> 4;
  const info = marker & 15;
  const payloadOffset = offset + 1;
  if (type === 0) {
    seen.delete(index);
    if (info === 8) return false;
    if (info === 9) return true;
    return null;
  }
  if (type === 1) {
    const value = readBinaryPlistInt(bytes, payloadOffset, 1 << info);
    seen.delete(index);
    return value;
  }
  if (type === 4) {
    const lengthInfo = readBinaryPlistLength(bytes, offset, info);
    const length = lengthInfo.length;
    const start = lengthInfo.offset;
    seen.delete(index);
    return bytes.slice(start, start + length);
  }
  if (type === 5 || type === 6) {
    const lengthInfo = readBinaryPlistLength(bytes, offset, info);
    const width = type === 6 ? 2 : 1;
    const data = bytes.slice(lengthInfo.offset, lengthInfo.offset + lengthInfo.length * width);
    seen.delete(index);
    return type === 6 ? decodeBinaryPlistUtf16Be(data) : new TextDecoder("utf-8", { fatal: false }).decode(data);
  }
  if (type === 3) {
    const seconds = readBinaryPlistFloat64(bytes, payloadOffset);
    seen.delete(index);
    return new Date(Date.UTC(2001, 0, 1) + seconds * 1e3).toISOString();
  }
  if (type === 10 || type === 12) {
    const lengthInfo = readBinaryPlistLength(bytes, offset, info);
    const values = [];
    for (let item = 0; item < lengthInfo.length; item++) {
      const ref = readBinaryPlistInt(bytes, lengthInfo.offset + item * objectRefSize, objectRefSize);
      values.push(readBinaryPlistObject(bytes, offsets, ref, objectRefSize, new Set(seen)));
    }
    seen.delete(index);
    return values;
  }
  if (type === 13) {
    const lengthInfo = readBinaryPlistLength(bytes, offset, info);
    const keyRefsStart = lengthInfo.offset;
    const valueRefsStart = keyRefsStart + lengthInfo.length * objectRefSize;
    const result = {};
    for (let item = 0; item < lengthInfo.length; item++) {
      const keyRef = readBinaryPlistInt(bytes, keyRefsStart + item * objectRefSize, objectRefSize);
      const valueRef = readBinaryPlistInt(bytes, valueRefsStart + item * objectRefSize, objectRefSize);
      const key = readBinaryPlistObject(bytes, offsets, keyRef, objectRefSize, new Set(seen));
      if (typeof key === "string") {
        result[key] = readBinaryPlistObject(bytes, offsets, valueRef, objectRefSize, new Set(seen));
      }
    }
    seen.delete(index);
    return result;
  }
  seen.delete(index);
  return null;
}
function readBinaryPlistLength(bytes, objectOffset, info) {
  if (info < 15) {
    return { length: info, offset: objectOffset + 1 };
  }
  const marker = bytes[objectOffset + 1];
  if (marker >> 4 !== 1) {
    throw new Error("Binary plist extended length \u7F3A\u5C11\u6574\u6570\u5BF9\u8C61\u3002");
  }
  const intSize = 1 << (marker & 15);
  return {
    length: readBinaryPlistInt(bytes, objectOffset + 2, intSize),
    offset: objectOffset + 2 + intSize
  };
}
function readBinaryPlistInt(bytes, offset, length) {
  if (offset < 0 || offset + length > bytes.length || length <= 0 || length > 8) {
    throw new Error("Binary plist integer \u8D85\u51FA\u6587\u4EF6\u8303\u56F4\u3002");
  }
  let value = 0;
  for (let index = 0; index < length; index++) {
    value = value * 256 + bytes[offset + index];
  }
  return value;
}
function readBinaryPlistFloat64(bytes, offset) {
  if (offset + 8 > bytes.length) {
    throw new Error("Binary plist date \u8D85\u51FA\u6587\u4EF6\u8303\u56F4\u3002");
  }
  return new DataView(bytes.buffer, bytes.byteOffset + offset, 8).getFloat64(0, false);
}
function decodeBinaryPlistUtf16Be(bytes) {
  let value = "";
  for (let index = 0; index + 1 < bytes.length; index += 2) {
    value += String.fromCharCode(bytes[index] << 8 | bytes[index + 1]);
  }
  return value;
}
function decodeBase64Data(value) {
  const normalized = value.replace(/\s+/g, "");
  if (!normalized) {
    return new Uint8Array();
  }
  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}
function createWebArchiveSnippet(value, mimeType) {
  if (!(value instanceof Uint8Array) || value.length === 0) {
    return void 0;
  }
  if (!mimeType || !/^(text\/|application\/(xhtml\+xml|xml|json)|image\/svg\+xml)/i.test(mimeType)) {
    return void 0;
  }
  const text = new TextDecoder("utf-8", { fatal: false }).decode(value);
  return text.replace(/\s+/g, " ").trim().slice(0, 1600);
}
function isPlistDict(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value) && !(value instanceof Uint8Array);
}
function plistString(value) {
  return typeof value === "string" ? value : void 0;
}
function asciiAt4(bytes, offset, length) {
  if (offset < 0 || offset + length > bytes.length) {
    return "";
  }
  return new TextDecoder("ascii").decode(bytes.slice(offset, offset + length));
}
async function createPostScriptPreview(bytes, url, fileName, size, fit, toolbar) {
  const parsed = parsePostScript(bytes);
  if (parsed.valid && parsed.pdfCompatible) {
    const embedded = await createPdfCompatibleAiPreview(bytes, url, fileName, size, fit, toolbar, parsed.pdfOffset || 0);
    return { element: embedded.element, instance: embedded.instance, primaryRendered: true };
  }
  const preview = document.createElement("div");
  preview.className = "ofv-data-preview";
  const heading = document.createElement("strong");
  heading.textContent = "PostScript \u7ED3\u6784";
  preview.append(heading);
  if (!parsed.valid) {
    const error = document.createElement("p");
    error.className = "ofv-data-error";
    error.textContent = parsed.error || "\u4E0D\u662F\u6709\u6548\u7684 PostScript/Illustrator \u6587\u6863\u5934\u3002";
    preview.append(error);
    return { element: preview };
  }
  const summary = document.createElement("div");
  summary.className = "ofv-data-summary";
  appendMeta(summary, "\u683C\u5F0F", parsed.format || "PostScript");
  appendMeta(summary, "Title", parsed.title || "\u672A\u58F0\u660E");
  appendMeta(summary, "Creator", parsed.creator || "\u672A\u58F0\u660E");
  appendMeta(summary, "Pages", parsed.pages || "\u672A\u77E5");
  appendMeta(summary, "BoundingBox", parsed.boundingBox || "\u672A\u58F0\u660E");
  appendMeta(summary, "Created", parsed.creationDate || "\u672A\u58F0\u660E");
  if (parsed.documentData) {
    appendMeta(summary, "Data", parsed.documentData);
  }
  preview.append(summary);
  return { element: preview };
}
async function createPdfCompatibleAiPreview(bytes, url, fileName, size, fit, toolbar, pdfOffset = 0, zoom = 1) {
  const wrapper = document.createElement("div");
  wrapper.className = "ofv-ai-pdf-preview";
  let pdfUrl = url;
  let shouldRevokePdfUrl = false;
  if (pdfOffset > 0) {
    pdfUrl = createObjectUrl({ blob: new Blob([bytes.slice(pdfOffset)], { type: "application/pdf" }) });
    shouldRevokePdfUrl = true;
  }
  const instance = await renderPdfDocumentPreview({
    fileName,
    fileUrl: pdfUrl,
    viewport: wrapper,
    size,
    fit,
    zoom,
    toolbar,
    fallbackTitle: "AI PDF \u517C\u5BB9\u9884\u89C8\u5931\u8D25",
    revokeUrlOnDestroy: false
  });
  hideSuccessfulPdfCompatibleAiDiagnostics(wrapper);
  return {
    element: wrapper,
    instance: {
      canCommand(command) {
        return instance.canCommand(command);
      },
      command(command) {
        return instance.command(command);
      },
      resize(size2) {
        instance.resize(size2);
      },
      destroy() {
        instance.destroy();
        if (shouldRevokePdfUrl) {
          revokeObjectUrl(pdfUrl, false);
        }
      }
    }
  };
}
function hideSuccessfulPdfCompatibleAiDiagnostics(wrapper) {
  if (!wrapper.querySelector(".ofv-pdf-page-wrapper")) {
    return;
  }
  for (const element of wrapper.querySelectorAll(".ofv-pdf-summary")) {
    hideSupplementalInfo8(element);
  }
}
function parsePostScript(bytes) {
  const pdfOffset = findPdfHeaderOffset(bytes);
  const head = new TextDecoder("latin1").decode(bytes.slice(pdfOffset >= 0 ? pdfOffset : 0, Math.min(bytes.length, (pdfOffset >= 0 ? pdfOffset : 0) + 8192)));
  const firstLine = head.split(/\r?\n/, 1)[0] || "";
  const isPdfCompatible = firstLine.startsWith("%PDF-");
  const isPostScript = firstLine.startsWith("%!");
  if (!isPdfCompatible && !isPostScript) {
    return { valid: false, error: "\u7F3A\u5C11 PostScript %! \u6216 PDF-compatible %PDF \u6587\u4EF6\u5934\u3002" };
  }
  const boundingBox = dscValue(head, "BoundingBox") || dscValue(head, "HiResBoundingBox");
  return {
    valid: true,
    pdfCompatible: isPdfCompatible,
    pdfOffset: isPdfCompatible ? Math.max(0, pdfOffset) : void 0,
    format: isPdfCompatible ? `PDF-compatible Illustrator (${firstLine.replace(/^%/, "")})` : firstLine.replace(/^%!/, "PostScript "),
    title: dscValue(head, "Title"),
    creator: dscValue(head, "Creator") || dscValue(head, "For"),
    creationDate: dscValue(head, "CreationDate"),
    pages: dscValue(head, "Pages"),
    boundingBox: normalizeBoundingBox(boundingBox),
    documentData: dscValue(head, "DocumentData")
  };
}
function findPdfHeaderOffset(bytes) {
  const max = Math.min(bytes.length - 4, 1024 * 1024);
  for (let index = 0; index <= max; index += 1) {
    if (bytes[index] === 37 && bytes[index + 1] === 80 && bytes[index + 2] === 68 && bytes[index + 3] === 70 && bytes[index + 4] === 45) {
      return index;
    }
  }
  return -1;
}
function dscValue(text, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = text.match(new RegExp(`^%%${escaped}:\\s*(.+)$`, "im"));
  return match?.[1]?.trim();
}
function normalizeBoundingBox(value) {
  if (!value) {
    return void 0;
  }
  const parts = value.trim().split(/\s+/).map((part) => Number(part));
  if (parts.length < 4 || parts.some((part) => !Number.isFinite(part))) {
    return value;
  }
  const [x1, y1, x2, y2] = parts;
  return `${x1}, ${y1}, ${x2}, ${y2} (${Math.max(0, x2 - x1)} x ${Math.max(0, y2 - y1)} pt)`;
}
function createHexPreview(bytes) {
  if (bytes.length === 0) {
    return null;
  }
  const pre = document.createElement("pre");
  pre.className = "ofv-text-block ofv-asset-hex";
  pre.textContent = hexPreview2(bytes);
  return pre;
}
function shouldShowHexPreview(extension, hasPrimaryPreview = false) {
  return !hasPrimaryPreview && !["ai", "eps", "ps"].includes(extension);
}
function hideSuccessfulSectionHeading4(section) {
  const heading = section.querySelector("h3");
  if (heading) {
    hideSupplementalInfo8(heading);
  }
}
function hideSuccessfulAssetDiagnostics(panel) {
  const hasPrimaryPreview = Boolean(
    panel.querySelector(
      ".ofv-ai-pdf-preview .ofv-pdf-page-wrapper, .ofv-psd-canvas, .ofv-font-preview, .ofv-wasm-preview, .ofv-sqlite-data, .ofv-parquet-records, .ofv-avro-records, .ofv-webarchive-snippet"
    )
  );
  if (!hasPrimaryPreview) {
    return;
  }
  for (const element of panel.querySelectorAll(
    ".ofv-section > h3, .ofv-asset-summary, .ofv-asset-download, .ofv-asset-hex, .ofv-data-preview, .ofv-pdf-summary"
  )) {
    hideSupplementalInfo8(element);
  }
}
function hideSupplementalInfo8(element) {
  element.hidden = true;
  element.setAttribute("aria-hidden", "true");
  element.style.display = "none";
}
function formatBytes4(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
function byteSignature3(bytes) {
  if (bytes.length === 0) {
    return "\u7A7A\u6587\u4EF6";
  }
  const ascii = new TextDecoder("ascii").decode(bytes.slice(0, Math.min(bytes.length, 16))).replace(/[^\x20-\x7E]/g, ".");
  const hex = Array.from(bytes.slice(0, Math.min(bytes.length, 8))).map((byte) => byte.toString(16).padStart(2, "0").toUpperCase()).join(" ");
  return `${ascii} (${hex})`;
}
function hexPreview2(bytes) {
  const rows = [];
  const limit = Math.min(bytes.length, 256);
  for (let offset = 0; offset < limit; offset += 16) {
    const slice = bytes.slice(offset, offset + 16);
    const hex = Array.from(slice).map((byte) => byte.toString(16).padStart(2, "0").toUpperCase()).join(" ").padEnd(47, " ");
    const ascii = Array.from(slice).map((byte) => byte >= 32 && byte <= 126 ? String.fromCharCode(byte) : ".").join("");
    rows.push(`${offset.toString(16).padStart(8, "0").toUpperCase()}  ${hex}  ${ascii}`);
  }
  if (bytes.length > limit) {
    rows.push(`... \u4EC5\u5C55\u793A\u524D ${limit} \u5B57\u8282\uFF0C\u5171 ${bytes.length} \u5B57\u8282`);
  }
  return rows.join("\n");
}
export {
  archivePlugin,
  assetPlugin,
  audioPlugin,
  cadPlugin,
  createViewer,
  drawingPlugin,
  emailPlugin,
  epubPlugin,
  fallbackPlugin,
  gisPlugin,
  imagePlugin,
  model3dPlugin,
  ofdPlugin,
  officePlugin,
  pdfPlugin,
  textPlugin,
  videoPlugin,
  xpsPlugin
};
//# sourceMappingURL=index.js.map