"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("app/chat/page",{

/***/ "(app-pages-browser)/./components/file-message.tsx":
/*!*************************************!*\
  !*** ./components/file-message.tsx ***!
  \*************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ FileMessage; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_file_icon__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-file-icon */ \"(app-pages-browser)/./node_modules/react-file-icon/dist/react-file-icon.esm.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n\nvar _s = $RefreshSig$();\n\n\nfunction FileMessage(param) {\n    let { file } = param;\n    var _file_name_split_pop;\n    _s();\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);\n    const extension = ((_file_name_split_pop = file.name.split(\".\").pop()) === null || _file_name_split_pop === void 0 ? void 0 : _file_name_split_pop.toLowerCase()) || \"\";\n    const isImage = file.type.startsWith(\"image/\");\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"flex items-center gap-2 mt-2\",\n        children: [\n            isImage ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"img\", {\n                src: file.url,\n                alt: file.name,\n                className: \"max-w-[200px] max-h-[200px] rounded\",\n                onError: ()=>setError(true)\n            }, void 0, false, {\n                fileName: \"/Users/christiancattaneo/Projects/slack-interface/components/file-message.tsx\",\n                lineNumber: 21,\n                columnNumber: 9\n            }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"w-8\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_file_icon__WEBPACK_IMPORTED_MODULE_1__.FileIcon, {\n                    extension: extension,\n                    ...react_file_icon__WEBPACK_IMPORTED_MODULE_1__.defaultStyles[extension]\n                }, void 0, false, {\n                    fileName: \"/Users/christiancattaneo/Projects/slack-interface/components/file-message.tsx\",\n                    lineNumber: 29,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/christiancattaneo/Projects/slack-interface/components/file-message.tsx\",\n                lineNumber: 28,\n                columnNumber: 9\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"a\", {\n                href: file.url,\n                target: \"_blank\",\n                rel: \"noopener noreferrer\",\n                className: \"text-blue-500 hover:underline\",\n                download: file.name,\n                children: file.name\n            }, void 0, false, {\n                fileName: \"/Users/christiancattaneo/Projects/slack-interface/components/file-message.tsx\",\n                lineNumber: 35,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/christiancattaneo/Projects/slack-interface/components/file-message.tsx\",\n        lineNumber: 19,\n        columnNumber: 5\n    }, this);\n}\n_s(FileMessage, \"AvrsuJm02Cqlq6/LWpvA21zDecQ=\");\n_c = FileMessage;\nvar _c;\n$RefreshReg$(_c, \"FileMessage\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwcC1wYWdlcy1icm93c2VyKS8uL2NvbXBvbmVudHMvZmlsZS1tZXNzYWdlLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQXlEO0FBQ3pCO0FBV2pCLFNBQVNHLFlBQVksS0FBMEI7UUFBMUIsRUFBRUMsSUFBSSxFQUFvQixHQUExQjtRQUVoQkE7O0lBRGxCLE1BQU0sQ0FBQ0MsT0FBT0MsU0FBUyxHQUFHSiwrQ0FBUUEsQ0FBQztJQUNuQyxNQUFNSyxZQUFZSCxFQUFBQSx1QkFBQUEsS0FBS0ksSUFBSSxDQUFDQyxLQUFLLENBQUMsS0FBS0MsR0FBRyxnQkFBeEJOLDJDQUFBQSxxQkFBNEJPLFdBQVcsT0FBTTtJQUMvRCxNQUFNQyxVQUFVUixLQUFLUyxJQUFJLENBQUNDLFVBQVUsQ0FBQztJQUVyQyxxQkFDRSw4REFBQ0M7UUFBSUMsV0FBVTs7WUFDWkosd0JBQ0MsOERBQUNLO2dCQUNDQyxLQUFLZCxLQUFLZSxHQUFHO2dCQUNiQyxLQUFLaEIsS0FBS0ksSUFBSTtnQkFDZFEsV0FBVTtnQkFDVkssU0FBUyxJQUFNZixTQUFTOzs7OztxQ0FHMUIsOERBQUNTO2dCQUFJQyxXQUFVOzBCQUNiLDRFQUFDaEIscURBQVFBO29CQUNQTyxXQUFXQTtvQkFDVixHQUFHTiwwREFBYSxDQUFDTSxVQUF3Qzs7Ozs7Ozs7Ozs7MEJBSWhFLDhEQUFDZTtnQkFDQ0MsTUFBTW5CLEtBQUtlLEdBQUc7Z0JBQ2RLLFFBQU87Z0JBQ1BDLEtBQUk7Z0JBQ0pULFdBQVU7Z0JBQ1ZVLFVBQVV0QixLQUFLSSxJQUFJOzBCQUVsQkosS0FBS0ksSUFBSTs7Ozs7Ozs7Ozs7O0FBSWxCO0dBakN3Qkw7S0FBQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9maWxlLW1lc3NhZ2UudHN4PzJkNjUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmlsZUljb24sIGRlZmF1bHRTdHlsZXMgfSBmcm9tICdyZWFjdC1maWxlLWljb24nXG5pbXBvcnQgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0J1xuXG5pbnRlcmZhY2UgRmlsZU1lc3NhZ2VQcm9wcyB7XG4gIGZpbGU6IHtcbiAgICBpZDogc3RyaW5nXG4gICAgbmFtZTogc3RyaW5nXG4gICAgdHlwZTogc3RyaW5nXG4gICAgdXJsOiBzdHJpbmdcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBGaWxlTWVzc2FnZSh7IGZpbGUgfTogRmlsZU1lc3NhZ2VQcm9wcykge1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKGZhbHNlKVxuICBjb25zdCBleHRlbnNpb24gPSBmaWxlLm5hbWUuc3BsaXQoJy4nKS5wb3AoKT8udG9Mb3dlckNhc2UoKSB8fCAnJ1xuICBjb25zdCBpc0ltYWdlID0gZmlsZS50eXBlLnN0YXJ0c1dpdGgoJ2ltYWdlLycpXG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGdhcC0yIG10LTJcIj5cbiAgICAgIHtpc0ltYWdlID8gKFxuICAgICAgICA8aW1nIFxuICAgICAgICAgIHNyYz17ZmlsZS51cmx9XG4gICAgICAgICAgYWx0PXtmaWxlLm5hbWV9XG4gICAgICAgICAgY2xhc3NOYW1lPVwibWF4LXctWzIwMHB4XSBtYXgtaC1bMjAwcHhdIHJvdW5kZWRcIlxuICAgICAgICAgIG9uRXJyb3I9eygpID0+IHNldEVycm9yKHRydWUpfVxuICAgICAgICAvPlxuICAgICAgKSA6IChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LThcIj5cbiAgICAgICAgICA8RmlsZUljb24gXG4gICAgICAgICAgICBleHRlbnNpb249e2V4dGVuc2lvbn0gXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFN0eWxlc1tleHRlbnNpb24gYXMga2V5b2YgdHlwZW9mIGRlZmF1bHRTdHlsZXNdfSBcbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICl9XG4gICAgICA8YSBcbiAgICAgICAgaHJlZj17ZmlsZS51cmx9XG4gICAgICAgIHRhcmdldD1cIl9ibGFua1wiXG4gICAgICAgIHJlbD1cIm5vb3BlbmVyIG5vcmVmZXJyZXJcIlxuICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LWJsdWUtNTAwIGhvdmVyOnVuZGVybGluZVwiXG4gICAgICAgIGRvd25sb2FkPXtmaWxlLm5hbWV9XG4gICAgICA+XG4gICAgICAgIHtmaWxlLm5hbWV9XG4gICAgICA8L2E+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuIl0sIm5hbWVzIjpbIkZpbGVJY29uIiwiZGVmYXVsdFN0eWxlcyIsInVzZVN0YXRlIiwiRmlsZU1lc3NhZ2UiLCJmaWxlIiwiZXJyb3IiLCJzZXRFcnJvciIsImV4dGVuc2lvbiIsIm5hbWUiLCJzcGxpdCIsInBvcCIsInRvTG93ZXJDYXNlIiwiaXNJbWFnZSIsInR5cGUiLCJzdGFydHNXaXRoIiwiZGl2IiwiY2xhc3NOYW1lIiwiaW1nIiwic3JjIiwidXJsIiwiYWx0Iiwib25FcnJvciIsImEiLCJocmVmIiwidGFyZ2V0IiwicmVsIiwiZG93bmxvYWQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(app-pages-browser)/./components/file-message.tsx\n"));

/***/ })

});