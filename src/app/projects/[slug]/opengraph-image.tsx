import { ImageResponse } from "next/og";
import { getProject, getProjectSlugs } from "@/lib/projects";
import { isVerified } from "@/lib/projects/types";
import { agencyConfig } from "@/lib/config/agency";

/**
 * Social share card for a project page.
 *
 * Most of this agency's traffic arrives from links pasted into WhatsApp and
 * Facebook, where the preview card is the entire first impression. Generating it
 * from project data means every future project gets one automatically, and the
 * card can never drift out of sync with the page.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Project overview";

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);

  const title = project?.hero.title ?? agencyConfig.name;
  const location = project?.hero.locationLabel ?? "Islamabad";
  const association =
    project && isVerified(project.hero.association)
      ? project.hero.association.value
      : agencyConfig.positioning;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(160deg, #101c3a 0%, #02071d 62%)",
          padding: "68px 76px",
          position: "relative",
        }}
      >
        {/* Ridge line, echoing the site's own artwork. */}
        <svg
          width="1200"
          height="360"
          viewBox="0 0 1200 360"
          style={{ position: "absolute", left: 0, bottom: 0, opacity: 0.5 }}
        >
          <path
            d="M0 224 L108 170 L214 218 L322 124 L446 192 L548 150 L664 208 L790 134 L886 196 L1006 154 L1108 208 L1200 174 L1200 360 L0 360 Z"
            fill="#1f2d4b"
          />
          <path
            d="M0 300 L132 238 L242 296 L378 200 L494 272 L614 222 L730 284 L858 212 L968 278 L1088 228 L1178 286 L1200 274 L1200 360 L0 360 Z"
            fill="#050b1f"
          />
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 1, background: "#e97430" }} />
          <div
            style={{
              fontSize: 21,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#f9c191",
              fontWeight: 600,
            }}
          >
            {agencyConfig.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: title.length > 22 ? 88 : 116,
              lineHeight: 1,
              color: "#faf8f4",
              letterSpacing: -2,
            }}
          >
            {title}
          </div>
          <div
            style={{
              marginTop: 30,
              fontSize: 31,
              color: "rgba(244,241,234,0.82)",
            }}
          >
            {location}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(250,248,244,0.18)",
            paddingTop: 26,
          }}
        >
          <div style={{ fontSize: 23, color: "rgba(244,241,234,0.68)" }}>
            {association}
          </div>
          <div style={{ fontSize: 23, color: "#f9c191", fontWeight: 600 }}>
            {agencyConfig.whatsappDisplay}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
