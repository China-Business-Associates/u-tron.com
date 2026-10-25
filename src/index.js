function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") {
    return false;
  }
  let mismatch = a.length === b.length ? 0 : 1;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const charA = i < a.length ? a.charCodeAt(i) : 0;
    const charB = i < b.length ? b.charCodeAt(i) : 0;
    mismatch |= charA ^ charB;
  }
  return mismatch === 0;
}

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

        if (!body || typeof body !== "object") {
          return Response.json(
            { ok: false, error: "Invalid request body." },
            { status: 400 }
          );
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

        // Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || email.length > 254 || !emailRegex.test(email)) {
          return Response.json(
            { ok: false, error: "Valid email address is required." },
            { status: 400 }
          );
        }

        if (name && name.length > 100) {
          return Response.json(
            { ok: false, error: "Name must be 100 characters or fewer." },
            { status: 400 }
          );
        }
        if (company && company.length > 100) {
          return Response.json(
            { ok: false, error: "Company must be 100 characters or fewer." },
            { status: 400 }
          );
        }
        if (phone && phone.length > 50) {
          return Response.json(
            { ok: false, error: "Phone must be 50 characters or fewer." },
            { status: 400 }
          );
        }
        if (inquiry_type && inquiry_type.length > 100) {
          return Response.json(
            { ok: false, error: "Inquiry type must be 100 characters or fewer." },
            { status: 400 }
          );
        }
        if (comment && comment.length > 5000) {
          return Response.json(
            { ok: false, error: "Comment must be 5000 characters or fewer." },
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

        if (!env.ADMIN_PASSWORD) {
          return Response.json(
            { ok: false, error: "Admin authentication not configured." },
            { status: 500 }
          );
        }

        if (!provided || !timingSafeEqual(provided, env.ADMIN_PASSWORD)) {
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
