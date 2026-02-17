
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../auth/AuthContext"
import styles from "../styles/AdminProfile.module.css"

function AdminProfile() {
  const { token } = useContext(AuthContext)

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchProfile() {
      if (!token) return

      try {
        const res = await fetch(
          "https://vidhividhan-2.onrender.com/api/admin/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (!res.ok) {
          setError("Failed to load settings")
          return
        }

        const data = await res.json()
        setProfile(data)
      } catch (err) {
        setError("Error loading profile")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [token])

  function handleChange(e) {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch(
        "https://vidhividhan-2.onrender.com/api/admin/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      )

      if (!res.ok) {
        setError("Failed to update settings")
        setSaving(false)
        return
      }

      const updated = await res.json()
      setProfile(updated)
      setMessage("Settings updated successfully ✅")
    } catch (err) {
      setError("Update failed")
    }

    setSaving(false)
  }

  if (loading) return <p>Loading settings...</p>
  if (!profile) return <p>Error loading settings</p>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Business Settings</h1>
        <p>Manage company details used in invoices</p>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}

      <form onSubmit={handleSave} className={styles.settingsForm}>

        {/* Account Info */}
        <section className={styles.section}>
          <h3>Account Info</h3>
          <div className={styles.formRow}>
            <input value={profile.mobile} disabled />
            <input value={profile.role} disabled />
          </div>
        </section>

        {/* Company Info */}
        <section className={styles.section}>
          <h3>Company Information</h3>

          <div className={styles.formRow}>
            <input
              name="ownername"
              placeholder="Owner Name"
              value={profile.ownername || ""}
              onChange={handleChange}
            />
            <input
              name="companyname"
              placeholder="Company Name"
              value={profile.companyname || ""}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formRow}>
            <input
              name="email"
              placeholder="Business Email"
              value={profile.email || ""}
              onChange={handleChange}
            />
            <input
              name="gstNumber"
              placeholder="GST Number"
              value={profile.gstNumber || ""}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formRow}>
            <input
              name="address1"
              placeholder="Address Line 1"
              value={profile.address1 || ""}
              onChange={handleChange}
            />
            <input
              name="address2"
              placeholder="Address Line 2"
              value={profile.address2 || ""}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Banking */}
        <section className={styles.section}>
          <h3>Banking Details</h3>

          <div className={styles.formRow}>
            <input
              name="acc"
              placeholder="Phone/UPI/Account"
              value={profile.acc || ""}
              onChange={handleChange}
            />
            <input
              name="iban"
              placeholder="IBAN"
              value={profile.iban || ""}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formRow}>
            <input
              name="bic"
              placeholder="BIC / SWIFT Code"
              value={profile.bic || ""}
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Invoice Defaults */}
        <section className={styles.section}>
          <h3>Invoice Defaults</h3>

          <div className={styles.formRow}>
            <input
              type="number"
              name="defaultTaxRate"
              placeholder="Default Tax Rate (%)"
              value={profile.defaultTaxRate || 18}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formRow}>
            <input
              name="footerText"
              placeholder="Footer Line 1"
              value={profile.footerText || ""}
              onChange={handleChange}
            />
            <input
              name="footerText2"
              placeholder="Footer Line 2"
              value={profile.footerText2 || ""}
              onChange={handleChange}
            />
          </div>
        </section>

        <div className={styles.saveWrapper}>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProfile
