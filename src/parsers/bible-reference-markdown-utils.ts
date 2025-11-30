import {LogosLink} from "../ui/bible-link-modal";

export const logosLinksToMarkdown = (links: LogosLink[]): string => links.map(logosLinkToMarkdown).join('');

export const logosLinkToMarkdown = (link: LogosLink): string => {
	return `<a class="bible-link" href="${createLogosLinkUrl(link)}">${link.displayText}</a>`;
}

export const createLogosLinkUrl = (link: LogosLink): string => `https://ref.ly/${link.linkPassage}`;
