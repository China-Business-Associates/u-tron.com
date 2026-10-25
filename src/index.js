export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Contact form submission endpoint
    if (url.pathname === "/api/contact" && request.method === "POST") {
      try {
        let body;
        const contentType = request.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          body = await request.json();
        } else if (
          contentType.includes("application/x-www-form-urlencoded") ||
          contentType.includes("multipart/form-data")
        ) {
          const formData = await request.formData();
          body = Object.fromEntries(formData.entries());
        } else {
          const text = await request.text();
          try {
            body = JSON.parse(text);
          } catch {
            return Response.json(
              { ok: false, error: "Unsupported content type." },
              { status: 415 }
            );
          }
        }

        // Honeypot spam filter
        if (body.fax) {
          return Response.json({ ok: true, success: true });
        }

        const name = (body.name || body.formName || body.inputName || "").trim() || null;
        const company =
          (body.company || body.org || body.formOrg || body.organization || body.companyname || "").trim() ||
          null;
        const dialCode = (body.dialCode || body.countryCode || "").trim();
        const rawPhone = (body.phone || body.formPhone || "").trim();
        const phone = rawPhone
          ? dialCode && !rawPhone.startsWith("+")
            ? `${dialCode} ${rawPhone}`
            : rawPhone
          : null;
        const email = (body.email || body.formEmail || body.inputEmail || "").trim();
        const inquiry_type =
          (body.inquiry_type || body.inquiryType || body.dept || body.formDept || "").trim() || null;
        const comment =
          (body.comment || body.message || body.formMsg || body.projectSpecs || "").trim() || null;

        // email is the only NOT NULL column
        if (!email) {
          return Response.json(
            { ok: false, error: "Email is required." },
            { status: 400 }
          );
        }

        if (!env.DB) {
          return Response.json(
            { ok: false, error: "Database binding 'DB' not configured." },
            { status: 500 }
          );
        }

        await env.DB.prepare(
          "INSERT INTO inquiries (name, company, phone, email, inquiry_type, comment) VALUES (?, ?, ?, ?, ?, ?)"
        )
          .bind(name, company, phone, email, inquiry_type, comment)
          .run();

        return Response.json({ ok: true, success: true });
      } catch (err) {
        return Response.json(
          { ok: false, error: err.message || "Something went wrong." },
          { status: 500 }
        );
      }
    }

    // 2. Admin leads query endpoint
    if (url.pathname === "/api/leads" && request.method === "GET") {
      try {
        const authHeader = request.headers.get("Authorization") || "";
        const customHeader = request.headers.get("x-admin-password") || "";
        const provided =
          customHeader ||
          (authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "");

        if (env.ADMIN_PASSWORD && provided !== env.ADMIN_PASSWORD) {
          return Response.json(
            { ok: false, error: "Unauthorized" },
            { status: 401 }
          );
        }

        if (!env.DB) {
          return Response.json(
            { ok: false, error: "Database binding 'DB' not configured." },
            { status: 500 }
          );
        }

        const { results } = await env.DB.prepare(
          "SELECT id, name, company, phone, email, inquiry_type, comment, created_at FROM inquiries ORDER BY id DESC LIMIT 500"
        ).all();

        return Response.json(
          { ok: true, success: true, leads: results || [] },
          {
            headers: { "Cache-Control": "no-store" }
          }
        );
      } catch (err) {
        return Response.json(
          { ok: false, error: err.message || "Failed to fetch leads." },
          { status: 500 }
        );
      }
    }

    // 3. Fallback to static assets
    return env.ASSETS.fetch(request);
  }
};
