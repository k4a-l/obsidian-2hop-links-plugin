import { App, PluginSettingTab, Setting } from "obsidian";
import TwohopLinksPlugin from "./main";

export interface TwohopPluginSettings {
  putOnTop: boolean;
  boxWidth: string;
  boxHeight: string;
  showImage: boolean;
  excludesDuplicateLinks: boolean;
  excludeBacklink: boolean;
  excludeFrontLink: boolean;
  excludeTag: boolean;
}

export const DEFAULT_SETTINGS: TwohopPluginSettings = {
  putOnTop: false,
  boxWidth: "162px",
  boxHeight: "178px",
  showImage: true,
  excludesDuplicateLinks: false,
  excludeBacklink: false,
  excludeFrontLink: false,
  excludeTag: false,
};

export class TwohopSettingTab extends PluginSettingTab {
  plugin: TwohopLinksPlugin;

  constructor(app: App, plugin: TwohopLinksPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const containerEl = this.containerEl;

    containerEl.empty();

    new Setting(containerEl)
      .setName("Box Width")
      .setDesc("Width of the boxes")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.boxWidth)
          .setValue(this.plugin.settings.boxWidth)
          .onChange(async (value) => {
            this.plugin.settings.boxWidth = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Box Height")
      .setDesc("Height of the boxes")
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.boxHeight)
          .setValue(this.plugin.settings.boxHeight)
          .onChange(async (value) => {
            this.plugin.settings.boxHeight = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Put 2hop links to top of the pane(Experimental).")
      .setDesc(
        "Known bugs: This configuration doesn't work with the 'Embedded Note Titles' plugin."
      )
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.putOnTop)
          .onChange(async (value) => {
            this.plugin.settings.putOnTop = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Show image in the 2hop links")
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.showImage)
          .onChange(async (value) => {
            this.plugin.settings.showImage = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Excludes duplicates links")
      .setDesc(
        "If two or more links have the same 2hop links, merge the link displays into one."
      )
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.excludesDuplicateLinks)
          .onChange(async (value) => {
            this.plugin.settings.excludesDuplicateLinks = value;
            await this.plugin.saveSettings();
          });
      });

    const excludeLinkTitle: [
      keyof TwohopPluginSettings,
      keyof TwohopPluginSettings,
      keyof TwohopPluginSettings
    ] = ["excludeFrontLink", "excludeBacklink", "excludeTag"];

    excludeLinkTitle.forEach((title) => {
      if (typeof this.plugin.settings[title] === "boolean") {
        new Setting(containerEl).setName(title).addToggle((toggle) => {
          toggle
            // @ts-ignore
            .setValue(this.plugin.settings[title])
            .onChange(async (value) => {
              // @ts-ignore
              this.plugin.settings[title] = value;
              await this.plugin.saveSettings();
            });
        });
      }
    });
  }
}
