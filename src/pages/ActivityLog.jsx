import { useEffect, useState } from 'react'

function ActivityLog() {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vv_activity_log')
      if (raw) {
        setEntries(JSON.parse(raw))
      }
    } catch {
      setEntries([])
    }
  }, [])

  return (
    <div className="invoice-list-page">
      <div className="page-header">
        <h1>Activity Log</h1>
      </div>

      {entries.length === 0 ? (
        <p>No activity recorded yet in this browser.</p>
      ) : (
        <div className="invoices-table">
          <div className="table-header">
            <div className="col-date">Time</div>
            <div className="col-client">Action</div>
            <div className="col-status">Entity</div>
            <div className="col-amount">Details</div>
          </div>
          {entries
            .slice()
            .reverse()
            .map((e, idx) => (
              <div key={idx} className="table-row">
                <div className="col-date" data-label="Time">
                  {e.time}
                </div>
                <div className="col-client" data-label="Action">
                  {e.action}
                </div>
                <div className="col-status" data-label="Entity">
                  {e.entity}
                </div>
                <div className="col-amount" data-label="Details">
                  {e.details}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default ActivityLog

