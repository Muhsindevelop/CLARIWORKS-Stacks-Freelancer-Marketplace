;; Bidding Contract
;; Manages bid submission and acceptance for jobs

(define-map bids
  { job-id: uint, freelancer: principal }
  {
    amount: uint,
    proposal-url: (string-utf8 256), ;; Gaia URL
    status: (string-ascii 20), ;; "pending", "accepted", "rejected"
    created-at: uint
  }
)

(define-public (submit-bid (job-id uint) (amount uint) (proposal-url (string-utf8 256)))
  (let ((caller tx-sender)
        (job (unwrap! (contract-call? .job-registry get-job job-id) (err u404))))
    ;; Verify job exists and is open
    (asserts! (is-eq (get status job) "open") (err u400))
    ;; Verify caller is registered as freelancer
    (asserts! (is-some (contract-call? .user-registry get-user caller)) (err u403))
    
    (map-set bids
      { job-id: job-id, freelancer: caller }
      {
        amount: amount,
        proposal-url: proposal-url,
        status: "pending",
        created-at: block-height
      }
    )
    (ok true)
  )
)

(define-public (accept-bid (job-id uint) (freelancer principal))
  (let ((caller tx-sender)
        (job (unwrap! (contract-call? .job-registry get-job job-id) (err u404)))
        (bid (unwrap! (map-get? bids { job-id: job-id, freelancer: freelancer }) (err u404))))
    ;; Verify caller is the client who posted the job
    (asserts! (is-eq (get client job) caller) (err u403))
    ;; Verify job is still open
    (asserts! (is-eq (get status job) "open") (err u400))
    
    ;; Update bid status
    (map-set bids
      { job-id: job-id, freelancer: freelancer }
      (merge bid { status: "accepted" })
    )
    
    ;; Create escrow for the job
    (try! (contract-call? .escrow create-escrow job-id freelancer))
    
    (ok true)
  )
)
