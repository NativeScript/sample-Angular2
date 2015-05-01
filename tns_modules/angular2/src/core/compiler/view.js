var __decorate = this.__decorate || function (decorators, target, key, value) {
    var kind = typeof (arguments.length == 2 ? value = target : value);
    for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        switch (kind) {
            case "function": value = decorator(value) || value; break;
            case "number": decorator(target, key, value); break;
            case "undefined": decorator(target, key); break;
            case "object": value = decorator(target, key, value) || value; break;
        }
    }
    return value;
};
var dom_adapter_1 = require('angular2/src/dom/dom_adapter');
var collection_1 = require('angular2/src/facade/collection');
var change_detection_1 = require('angular2/change_detection');
var element_injector_1 = require('./element_injector');
var element_binder_1 = require('./element_binder');
var types_1 = require('angular2/src/reflection/types');
var lang_1 = require('angular2/src/facade/lang');
var di_1 = require('angular2/di');
var element_1 = require('angular2/src/core/dom/element');
var view_container_1 = require('./view_container');
var light_dom_1 = require('./shadow_dom_emulation/light_dom');
var content_tag_1 = require('./shadow_dom_emulation/content_tag');
var shadow_dom_strategy_1 = require('./shadow_dom_strategy');
var view_pool_1 = require('./view_pool');
var event_manager_1 = require('angular2/src/render/dom/events/event_manager');
var NG_BINDING_CLASS = 'ng-binding';
var NG_BINDING_CLASS_SELECTOR = '.ng-binding';
var VIEW_POOL_CAPACITY = 10000;
var VIEW_POOL_PREFILL = 0;
var View = (function () {
    function View(proto, nodes, protoLocals) {
        this.proto = proto;
        this.nodes = nodes;
        this.changeDetector = null;
        this.elementInjectors = null;
        this.rootElementInjectors = null;
        this.textNodes = null;
        this.bindElements = null;
        this.componentChildViews = null;
        this.viewContainers = null;
        this.contentTags = null;
        this.preBuiltObjects = null;
        this.lightDoms = null;
        this.context = null;
        this.locals = new change_detection_1.Locals(null, collection_1.MapWrapper.clone(protoLocals));
    }
    View.prototype.init = function (changeDetector, elementInjectors, rootElementInjectors, textNodes, bindElements, viewContainers, contentTags, preBuiltObjects, componentChildViews, lightDoms) {
        this.changeDetector = changeDetector;
        this.elementInjectors = elementInjectors;
        this.rootElementInjectors = rootElementInjectors;
        this.textNodes = textNodes;
        this.bindElements = bindElements;
        this.viewContainers = viewContainers;
        this.contentTags = contentTags;
        this.preBuiltObjects = preBuiltObjects;
        this.componentChildViews = componentChildViews;
        this.lightDoms = lightDoms;
    };
    View.prototype.setLocal = function (contextName, value) {
        if (!this.hydrated())
            throw new lang_1.BaseException('Cannot set locals on dehydrated view.');
        if (!collection_1.MapWrapper.contains(this.proto.variableBindings, contextName)) {
            return;
        }
        var templateName = collection_1.MapWrapper.get(this.proto.variableBindings, contextName);
        this.locals.set(templateName, value);
    };
    View.prototype.hydrated = function () {
        return lang_1.isPresent(this.context);
    };
    View.prototype._hydrateContext = function (newContext, locals) {
        this.context = newContext;
        this.locals.parent = locals;
        this.changeDetector.hydrate(this.context, this.locals);
    };
    View.prototype._dehydrateContext = function () {
        if (lang_1.isPresent(this.locals)) {
            this.locals.clearValues();
        }
        this.context = null;
        this.changeDetector.dehydrate();
    };
    View.prototype.hydrate = function (appInjector, hostElementInjector, hostLightDom, context, locals) {
        if (this.hydrated())
            throw new lang_1.BaseException('The view is already hydrated.');
        this._hydrateContext(context, locals);
        for (var i = 0; i < this.viewContainers.length; i++) {
            var vc = this.viewContainers[i];
            if (lang_1.isPresent(vc)) {
                vc.hydrate(appInjector, hostElementInjector, hostLightDom);
            }
        }
        var binders = this.proto.elementBinders;
        var componentChildViewIndex = 0;
        for (var i = 0; i < binders.length; ++i) {
            var componentDirective = binders[i].componentDirective;
            var shadowDomAppInjector = null;
            if (lang_1.isPresent(componentDirective)) {
                var services = componentDirective.annotation.services;
                if (lang_1.isPresent(services))
                    shadowDomAppInjector = appInjector.createChild(services);
                else {
                    shadowDomAppInjector = appInjector;
                }
            }
            else {
                shadowDomAppInjector = null;
            }
            var elementInjector = this.elementInjectors[i];
            if (lang_1.isPresent(elementInjector)) {
                elementInjector.instantiateDirectives(appInjector, shadowDomAppInjector, this.preBuiltObjects[i]);
                var exportImplicitName = elementInjector.getExportImplicitName();
                if (elementInjector.isExportingComponent()) {
                    this.locals.set(exportImplicitName, elementInjector.getComponent());
                }
                else if (elementInjector.isExportingElement()) {
                    this.locals.set(exportImplicitName, elementInjector.getNgElement().domElement);
                }
            }
            if (lang_1.isPresent(binders[i].nestedProtoView) && lang_1.isPresent(componentDirective)) {
                this.componentChildViews[componentChildViewIndex++].hydrate(shadowDomAppInjector, elementInjector, this.lightDoms[i], elementInjector.getComponent(), null);
            }
        }
        for (var i = 0; i < this.lightDoms.length; ++i) {
            var lightDom = this.lightDoms[i];
            if (lang_1.isPresent(lightDom)) {
                lightDom.redistribute();
            }
        }
    };
    View.prototype.dehydrate = function () {
        for (var i = 0; i < this.componentChildViews.length; i++) {
            this.componentChildViews[i].dehydrate();
        }
        for (var i = 0; i < this.elementInjectors.length; i++) {
            if (lang_1.isPresent(this.elementInjectors[i])) {
                this.elementInjectors[i].clearDirectives();
            }
        }
        if (lang_1.isPresent(this.viewContainers)) {
            for (var i = 0; i < this.viewContainers.length; i++) {
                var vc = this.viewContainers[i];
                if (lang_1.isPresent(vc)) {
                    vc.dehydrate();
                }
            }
        }
        this._dehydrateContext();
    };
    View.prototype.triggerEventHandlers = function (eventName, eventObj, binderIndex) {
        var handlers = this.proto.eventHandlers[binderIndex];
        if (lang_1.isBlank(handlers))
            return;
        var handler = collection_1.StringMapWrapper.get(handlers, eventName);
        if (lang_1.isBlank(handler))
            return;
        handler(eventObj, this);
    };
    View.prototype.onAllChangesDone = function (directiveMemento) {
        var dir = directiveMemento.directive(this.elementInjectors);
        dir.onAllChangesDone();
    };
    View.prototype.onChange = function (directiveMemento, changes) {
        var dir = directiveMemento.directive(this.elementInjectors);
        dir.onChange(changes);
    };
    View.prototype.invokeMementoFor = function (memento, currentValue) {
        if (memento instanceof DirectiveBindingMemento) {
            var directiveMemento = memento;
            directiveMemento.invoke(currentValue, this.elementInjectors);
        }
        else if (memento instanceof ElementBindingMemento) {
            var elementMemento = memento;
            elementMemento.invoke(currentValue, this.bindElements);
        }
        else {
            var textNodeIndex = memento;
            dom_adapter_1.DOM.setText(this.textNodes[textNodeIndex], currentValue);
        }
    };
    return View;
})();
exports.View = View;
Object.defineProperty(View, "annotations", { get: function () {
        return [new lang_1.IMPLEMENTS(change_detection_1.ChangeDispatcher)];
    } });
Object.defineProperty(View, "parameters", { get: function () {
        return [[ProtoView], [collection_1.List], [collection_1.Map]];
    } });
Object.defineProperty(View.prototype.init, "parameters", { get: function () {
        return [[change_detection_1.ChangeDetector], [collection_1.List], [collection_1.List], [collection_1.List], [collection_1.List], [collection_1.List], [collection_1.List], [collection_1.List], [collection_1.List], [assert.genericType(collection_1.List, light_dom_1.LightDom)]];
    } });
Object.defineProperty(View.prototype.setLocal, "parameters", { get: function () {
        return [[assert.type.string], []];
    } });
Object.defineProperty(View.prototype.hydrate, "parameters", { get: function () {
        return [[di_1.Injector], [element_injector_1.ElementInjector], [light_dom_1.LightDom], [Object], [change_detection_1.Locals]];
    } });
Object.defineProperty(View.prototype.triggerEventHandlers, "parameters", { get: function () {
        return [[assert.type.string], [], [lang_1.int]];
    } });
Object.defineProperty(View.prototype.onAllChangesDone, "parameters", { get: function () {
        return [[DirectiveMemento]];
    } });
Object.defineProperty(View.prototype.onChange, "parameters", { get: function () {
        return [[DirectiveMemento], []];
    } });
Object.defineProperty(View.prototype.invokeMementoFor, "parameters", { get: function () {
        return [[assert.type.any], [assert.type.any]];
    } });
var ProtoView = (function () {
    function ProtoView(template, protoChangeDetector, shadowDomStrategy, parentProtoView) {
        if (parentProtoView === void 0) { parentProtoView = null; }
        this.element = template;
        this.elementBinders = [];
        this.variableBindings = collection_1.MapWrapper.create();
        this.protoLocals = collection_1.MapWrapper.create();
        this.protoChangeDetector = protoChangeDetector;
        this.parentProtoView = parentProtoView;
        this.textNodesWithBindingCount = 0;
        this.elementsWithBindingCount = 0;
        this.instantiateInPlace = false;
        this.rootBindingOffset = (lang_1.isPresent(this.element) && dom_adapter_1.DOM.hasClass(this.element, NG_BINDING_CLASS)) ? 1 : 0;
        this.isTemplateElement = dom_adapter_1.DOM.isTemplateElement(this.element);
        this.shadowDomStrategy = shadowDomStrategy;
        this._viewPool = new view_pool_1.ViewPool(VIEW_POOL_CAPACITY);
        this.stylePromises = [];
        this.eventHandlers = [];
        this.bindingRecords = [];
        this._directiveMementosMap = collection_1.MapWrapper.create();
        this._variableBindings = null;
        this._directiveMementos = null;
    }
    ProtoView.prototype.instantiate = function (hostElementInjector, eventManager) {
        if (this._viewPool.length() == 0)
            this._preFillPool(hostElementInjector, eventManager);
        var view = this._viewPool.pop();
        return lang_1.isPresent(view) ? view : this._instantiate(hostElementInjector, eventManager);
    };
    ProtoView.prototype._preFillPool = function (hostElementInjector, eventManager) {
        for (var i = 0; i < VIEW_POOL_PREFILL; i++) {
            this._viewPool.push(this._instantiate(hostElementInjector, eventManager));
        }
    };
    ProtoView.prototype._getVariableBindings = function () {
        var _this = this;
        if (lang_1.isPresent(this._variableBindings)) {
            return this._variableBindings;
        }
        this._variableBindings = lang_1.isPresent(this.parentProtoView) ? collection_1.ListWrapper.clone(this.parentProtoView._getVariableBindings()) : [];
        collection_1.MapWrapper.forEach(this.protoLocals, function (v, local) {
            collection_1.ListWrapper.push(_this._variableBindings, local);
        });
        return this._variableBindings;
    };
    ProtoView.prototype._getDirectiveMementos = function () {
        if (lang_1.isPresent(this._directiveMementos)) {
            return this._directiveMementos;
        }
        this._directiveMementos = [];
        for (var injectorIndex = 0; injectorIndex < this.elementBinders.length; ++injectorIndex) {
            var pei = this.elementBinders[injectorIndex].protoElementInjector;
            if (lang_1.isPresent(pei)) {
                for (var directiveIndex = 0; directiveIndex < pei.numberOfDirectives; ++directiveIndex) {
                    collection_1.ListWrapper.push(this._directiveMementos, this._getDirectiveMemento(injectorIndex, directiveIndex));
                }
            }
        }
        return this._directiveMementos;
    };
    ProtoView.prototype._instantiate = function (hostElementInjector, eventManager) {
        var rootElementClone = this.instantiateInPlace ? this.element : dom_adapter_1.DOM.importIntoDoc(this.element);
        var elementsWithBindingsDynamic;
        if (this.isTemplateElement) {
            elementsWithBindingsDynamic = dom_adapter_1.DOM.querySelectorAll(dom_adapter_1.DOM.content(rootElementClone), NG_BINDING_CLASS_SELECTOR);
        }
        else {
            elementsWithBindingsDynamic = dom_adapter_1.DOM.getElementsByClassName(rootElementClone, NG_BINDING_CLASS);
        }
        var elementsWithBindings = collection_1.ListWrapper.createFixedSize(elementsWithBindingsDynamic.length);
        for (var binderIdx = 0; binderIdx < elementsWithBindingsDynamic.length; ++binderIdx) {
            elementsWithBindings[binderIdx] = elementsWithBindingsDynamic[binderIdx];
        }
        var viewNodes;
        if (this.isTemplateElement) {
            var childNode = dom_adapter_1.DOM.firstChild(dom_adapter_1.DOM.content(rootElementClone));
            viewNodes = [];
            while (childNode != null) {
                collection_1.ListWrapper.push(viewNodes, childNode);
                childNode = dom_adapter_1.DOM.nextSibling(childNode);
            }
        }
        else {
            viewNodes = [rootElementClone];
        }
        var view = new View(this, viewNodes, this.protoLocals);
        var changeDetector = this.protoChangeDetector.instantiate(view, this.bindingRecords, this._getVariableBindings(), this._getDirectiveMementos());
        var binders = this.elementBinders;
        var elementInjectors = collection_1.ListWrapper.createFixedSize(binders.length);
        var eventHandlers = collection_1.ListWrapper.createFixedSize(binders.length);
        var rootElementInjectors = [];
        var textNodes = [];
        var elementsWithPropertyBindings = [];
        var preBuiltObjects = collection_1.ListWrapper.createFixedSize(binders.length);
        var viewContainers = collection_1.ListWrapper.createFixedSize(binders.length);
        var contentTags = collection_1.ListWrapper.createFixedSize(binders.length);
        var componentChildViews = [];
        var lightDoms = collection_1.ListWrapper.createFixedSize(binders.length);
        for (var binderIdx = 0; binderIdx < binders.length; binderIdx++) {
            var binder = binders[binderIdx];
            var element;
            if (binderIdx === 0 && this.rootBindingOffset === 1) {
                element = rootElementClone;
            }
            else {
                element = elementsWithBindings[binderIdx - this.rootBindingOffset];
            }
            var elementInjector = null;
            var protoElementInjector = binder.protoElementInjector;
            if (lang_1.isPresent(protoElementInjector)) {
                if (lang_1.isPresent(protoElementInjector.parent)) {
                    var parentElementInjector = elementInjectors[protoElementInjector.parent.index];
                    elementInjector = protoElementInjector.instantiate(parentElementInjector, null);
                }
                else {
                    elementInjector = protoElementInjector.instantiate(null, hostElementInjector);
                    collection_1.ListWrapper.push(rootElementInjectors, elementInjector);
                }
            }
            elementInjectors[binderIdx] = elementInjector;
            if (binder.hasElementPropertyBindings) {
                collection_1.ListWrapper.push(elementsWithPropertyBindings, element);
            }
            var textNodeIndices = binder.textNodeIndices;
            if (lang_1.isPresent(textNodeIndices)) {
                var childNode = dom_adapter_1.DOM.firstChild(dom_adapter_1.DOM.templateAwareRoot(element));
                for (var j = 0, k = 0; j < textNodeIndices.length; j++) {
                    for (var index = textNodeIndices[j]; k < index; k++) {
                        childNode = dom_adapter_1.DOM.nextSibling(childNode);
                    }
                    collection_1.ListWrapper.push(textNodes, childNode);
                }
            }
            var lightDom = null;
            var bindingPropagationConfig = null;
            if (lang_1.isPresent(binder.nestedProtoView) && lang_1.isPresent(binder.componentDirective)) {
                var strategy = this.shadowDomStrategy;
                var childView = binder.nestedProtoView.instantiate(elementInjector, eventManager);
                changeDetector.addChild(childView.changeDetector);
                lightDom = strategy.constructLightDom(view, childView, element);
                strategy.attachTemplate(element, childView);
                bindingPropagationConfig = new change_detection_1.BindingPropagationConfig(childView.changeDetector);
                collection_1.ListWrapper.push(componentChildViews, childView);
            }
            lightDoms[binderIdx] = lightDom;
            var destLightDom = null;
            if (lang_1.isPresent(binder.parent) && binder.distanceToParent === 1) {
                destLightDom = lightDoms[binder.parent.index];
            }
            var viewContainer = null;
            if (lang_1.isPresent(binder.viewportDirective)) {
                viewContainer = new view_container_1.ViewContainer(view, element, binder.nestedProtoView, elementInjector, eventManager, destLightDom);
            }
            viewContainers[binderIdx] = viewContainer;
            var contentTag = null;
            if (lang_1.isPresent(binder.contentTagSelector)) {
                contentTag = new content_tag_1.Content(destLightDom, element, binder.contentTagSelector);
            }
            contentTags[binderIdx] = contentTag;
            if (lang_1.isPresent(elementInjector)) {
                preBuiltObjects[binderIdx] = new element_injector_1.PreBuiltObjects(view, new element_1.NgElement(element), viewContainer, bindingPropagationConfig);
            }
            if (lang_1.isPresent(binder.events)) {
                eventHandlers[binderIdx] = collection_1.StringMapWrapper.create();
                collection_1.StringMapWrapper.forEach(binder.events, function (eventMap, eventName) {
                    var handler = ProtoView.buildEventHandler(eventMap, binderIdx);
                    collection_1.StringMapWrapper.set(eventHandlers[binderIdx], eventName, handler);
                    if (lang_1.isBlank(elementInjector) || !elementInjector.hasEventEmitter(eventName)) {
                        eventManager.addEventListener(element, eventName, function (event) {
                            handler(event, view);
                        });
                    }
                });
            }
        }
        this.eventHandlers = eventHandlers;
        view.init(changeDetector, elementInjectors, rootElementInjectors, textNodes, elementsWithPropertyBindings, viewContainers, contentTags, preBuiltObjects, componentChildViews, lightDoms);
        return view;
    };
    ProtoView.prototype.returnToPool = function (view) {
        this._viewPool.push(view);
    };
    ProtoView.buildEventHandler = function (eventMap, injectorIdx) {
        var locals = collection_1.MapWrapper.create();
        return function (event, view) {
            if (view.hydrated()) {
                collection_1.MapWrapper.set(locals, '$event', event);
                collection_1.MapWrapper.forEach(eventMap, function (expr, directiveIndex) {
                    var context;
                    if (directiveIndex === -1) {
                        context = view.context;
                    }
                    else {
                        context = view.elementInjectors[injectorIdx].getDirectiveAtIndex(directiveIndex);
                    }
                    expr.eval(context, new change_detection_1.Locals(view.locals, locals));
                });
            }
        };
    };
    ProtoView.prototype.bindVariable = function (contextName, templateName) {
        collection_1.MapWrapper.set(this.variableBindings, contextName, templateName);
        collection_1.MapWrapper.set(this.protoLocals, templateName, null);
    };
    ProtoView.prototype.bindElement = function (parent, distanceToParent, protoElementInjector, componentDirective, viewportDirective) {
        if (componentDirective === void 0) { componentDirective = null; }
        if (viewportDirective === void 0) { viewportDirective = null; }
        var elBinder = new element_binder_1.ElementBinder(this.elementBinders.length, parent, distanceToParent, protoElementInjector, componentDirective, viewportDirective);
        collection_1.ListWrapper.push(this.elementBinders, elBinder);
        return elBinder;
    };
    ProtoView.prototype.bindTextNode = function (indexInParent, expression) {
        var elBinder = this.elementBinders[this.elementBinders.length - 1];
        if (lang_1.isBlank(elBinder.textNodeIndices)) {
            elBinder.textNodeIndices = collection_1.ListWrapper.create();
        }
        collection_1.ListWrapper.push(elBinder.textNodeIndices, indexInParent);
        var memento = this.textNodesWithBindingCount++;
        collection_1.ListWrapper.push(this.bindingRecords, new change_detection_1.BindingRecord(expression, memento, null));
    };
    ProtoView.prototype.bindElementProperty = function (expression, setterName, setter) {
        var elBinder = this.elementBinders[this.elementBinders.length - 1];
        if (!elBinder.hasElementPropertyBindings) {
            elBinder.hasElementPropertyBindings = true;
            this.elementsWithBindingCount++;
        }
        var memento = new ElementBindingMemento(this.elementsWithBindingCount - 1, setter);
        collection_1.ListWrapper.push(this.bindingRecords, new change_detection_1.BindingRecord(expression, memento, null));
    };
    ProtoView.prototype.bindEvent = function (eventName, expression, directiveIndex) {
        if (directiveIndex === void 0) { directiveIndex = -1; }
        var elBinder = this.elementBinders[this.elementBinders.length - 1];
        var events = elBinder.events;
        if (lang_1.isBlank(events)) {
            events = collection_1.StringMapWrapper.create();
            elBinder.events = events;
        }
        var event = collection_1.StringMapWrapper.get(events, eventName);
        if (lang_1.isBlank(event)) {
            event = collection_1.MapWrapper.create();
            collection_1.StringMapWrapper.set(events, eventName, event);
        }
        collection_1.MapWrapper.set(event, directiveIndex, expression);
    };
    ProtoView.prototype.bindDirectiveProperty = function (directiveIndex, expression, setterName, setter) {
        var elementIndex = this.elementBinders.length - 1;
        var bindingMemento = new DirectiveBindingMemento(elementIndex, directiveIndex, setterName, setter);
        var directiveMemento = this._getDirectiveMemento(elementIndex, directiveIndex);
        collection_1.ListWrapper.push(this.bindingRecords, new change_detection_1.BindingRecord(expression, bindingMemento, directiveMemento));
    };
    ProtoView.prototype._getDirectiveMemento = function (elementInjectorIndex, directiveIndex) {
        var id = elementInjectorIndex * 100 + directiveIndex;
        var protoElementInjector = this.elementBinders[elementInjectorIndex].protoElementInjector;
        if (!collection_1.MapWrapper.contains(this._directiveMementosMap, id)) {
            var binding = protoElementInjector.getDirectiveBindingAtIndex(directiveIndex);
            collection_1.MapWrapper.set(this._directiveMementosMap, id, new DirectiveMemento(elementInjectorIndex, directiveIndex, binding.callOnAllChangesDone, binding.callOnChange));
        }
        return collection_1.MapWrapper.get(this._directiveMementosMap, id);
    };
    ProtoView.createRootProtoView = function (protoView, insertionElement, rootComponentBinding, protoChangeDetector, shadowDomStrategy) {
        dom_adapter_1.DOM.addClass(insertionElement, NG_BINDING_CLASS);
        var cmpType = rootComponentBinding.key.token;
        var rootProtoView = new ProtoView(insertionElement, protoChangeDetector, shadowDomStrategy);
        rootProtoView.instantiateInPlace = true;
        var binder = rootProtoView.bindElement(null, 0, new element_injector_1.ProtoElementInjector(null, 0, [cmpType], true));
        binder.componentDirective = rootComponentBinding;
        binder.nestedProtoView = protoView;
        shadowDomStrategy.shimAppElement(cmpType, insertionElement);
        return rootProtoView;
    };
    return ProtoView;
})();
exports.ProtoView = ProtoView;
Object.defineProperty(ProtoView, "parameters", { get: function () {
        return [[], [change_detection_1.ProtoChangeDetector], [shadow_dom_strategy_1.ShadowDomStrategy], [ProtoView]];
    } });
Object.defineProperty(ProtoView.prototype.instantiate, "parameters", { get: function () {
        return [[element_injector_1.ElementInjector], [event_manager_1.EventManager]];
    } });
Object.defineProperty(ProtoView.prototype._preFillPool, "parameters", { get: function () {
        return [[element_injector_1.ElementInjector], [event_manager_1.EventManager]];
    } });
Object.defineProperty(ProtoView.prototype._instantiate, "parameters", { get: function () {
        return [[element_injector_1.ElementInjector], [event_manager_1.EventManager]];
    } });
Object.defineProperty(ProtoView.prototype.returnToPool, "parameters", { get: function () {
        return [[View]];
    } });
Object.defineProperty(ProtoView.buildEventHandler, "parameters", { get: function () {
        return [[collection_1.Map], [lang_1.int]];
    } });
Object.defineProperty(ProtoView.prototype.bindVariable, "parameters", { get: function () {
        return [[assert.type.string], [assert.type.string]];
    } });
Object.defineProperty(ProtoView.prototype.bindElement, "parameters", { get: function () {
        return [[element_binder_1.ElementBinder], [lang_1.int], [element_injector_1.ProtoElementInjector], [element_injector_1.DirectiveBinding], [element_injector_1.DirectiveBinding]];
    } });
Object.defineProperty(ProtoView.prototype.bindTextNode, "parameters", { get: function () {
        return [[lang_1.int], [change_detection_1.AST]];
    } });
Object.defineProperty(ProtoView.prototype.bindElementProperty, "parameters", { get: function () {
        return [[change_detection_1.AST], [assert.type.string], [types_1.SetterFn]];
    } });
Object.defineProperty(ProtoView.prototype.bindEvent, "parameters", { get: function () {
        return [[assert.type.string], [change_detection_1.AST], [lang_1.int]];
    } });
Object.defineProperty(ProtoView.prototype.bindDirectiveProperty, "parameters", { get: function () {
        return [[assert.type.number], [change_detection_1.AST], [assert.type.string], [types_1.SetterFn]];
    } });
Object.defineProperty(ProtoView.prototype._getDirectiveMemento, "parameters", { get: function () {
        return [[assert.type.number], [assert.type.number]];
    } });
Object.defineProperty(ProtoView.createRootProtoView, "parameters", { get: function () {
        return [[ProtoView], [], [element_injector_1.DirectiveBinding], [change_detection_1.ProtoChangeDetector], [shadow_dom_strategy_1.ShadowDomStrategy]];
    } });
var ElementBindingMemento = (function () {
    function ElementBindingMemento(elementIndex, setter) {
        this._elementIndex = elementIndex;
        this._setter = setter;
    }
    ElementBindingMemento.prototype.invoke = function (currentValue, bindElements) {
        var element = bindElements[this._elementIndex];
        this._setter(element, currentValue);
    };
    return ElementBindingMemento;
})();
exports.ElementBindingMemento = ElementBindingMemento;
Object.defineProperty(ElementBindingMemento, "parameters", { get: function () {
        return [[lang_1.int], [types_1.SetterFn]];
    } });
Object.defineProperty(ElementBindingMemento.prototype.invoke, "parameters", { get: function () {
        return [[assert.type.any], [collection_1.List]];
    } });
var DirectiveBindingMemento = (function () {
    function DirectiveBindingMemento(elementInjectorIndex, directiveIndex, propertyName, setter) {
        this._elementInjectorIndex = elementInjectorIndex;
        this._directiveIndex = directiveIndex;
        this.propertyName = propertyName;
        this._setter = setter;
    }
    DirectiveBindingMemento.prototype.invoke = function (currentValue, elementInjectors) {
        var elementInjector = elementInjectors[this._elementInjectorIndex];
        var directive = elementInjector.getDirectiveAtIndex(this._directiveIndex);
        this._setter(directive, currentValue);
    };
    return DirectiveBindingMemento;
})();
exports.DirectiveBindingMemento = DirectiveBindingMemento;
Object.defineProperty(DirectiveBindingMemento, "parameters", { get: function () {
        return [[assert.type.number], [assert.type.number], [assert.type.string], [types_1.SetterFn]];
    } });
Object.defineProperty(DirectiveBindingMemento.prototype.invoke, "parameters", { get: function () {
        return [[assert.type.any], [assert.genericType(collection_1.List, element_injector_1.ElementInjector)]];
    } });
var DirectiveMemento = (function () {
    function DirectiveMemento(elementInjectorIndex, directiveIndex, callOnAllChangesDone, callOnChange) {
        this._elementInjectorIndex = elementInjectorIndex;
        this._directiveIndex = directiveIndex;
        this.callOnAllChangesDone = callOnAllChangesDone;
        this.callOnChange = callOnChange;
    }
    DirectiveMemento.prototype.directive = function (elementInjectors) {
        var elementInjector = elementInjectors[this._elementInjectorIndex];
        return elementInjector.getDirectiveAtIndex(this._directiveIndex);
    };
    return DirectiveMemento;
})();
Object.defineProperty(DirectiveMemento, "parameters", { get: function () {
        return [[assert.type.number], [assert.type.number], [assert.type.boolean], [assert.type.boolean]];
    } });
Object.defineProperty(DirectiveMemento.prototype.directive, "parameters", { get: function () {
        return [[assert.genericType(collection_1.List, element_injector_1.ElementInjector)]];
    } });
