import { withPluginApi } from "discourse/lib/plugin-api";
import discourseComputed from "discourse-common/utils/decorators";
import User from "discourse/models/user";
import EmberObject from "@ember/object";
import { ajax } from "discourse/lib/ajax";

export default {
  name: "user-card-directory",
  initialize(container) {
    // This component provides a responsive template

    withPluginApi("0.8.7", api => {
      api.modifyClass("route:users", {
        resetController(controller, isExiting) {
          this._super(...arguments);
          if (isExiting) {
            controller.set("cachedUserCardInfo", {});
          }
        }
      });

      api.modifyClass("controller:users", {
        cachedUserCardInfo: null,
        @discourseComputed("site.groups")
        availableGroups(groups) {
          return groups
            .map(g => {
              // prevents group "everyone" to be listed
              if (g.id !== 0) {
                return { name: g.name, value: g.name };
              }
            })
            .filter(Boolean);
        }
      });
    });
  }
};
