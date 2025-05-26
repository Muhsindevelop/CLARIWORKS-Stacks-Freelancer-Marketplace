;; Escrow Contract
;; Handles secure payments and dispute resolution

(define-map escrows 
  { job-id: uint } 
  { 
    client: principal,
    freelancer: principal,
    amount: uint,
    status: (string-ascii 20), ;; "locked", "released", "refunded", "disputed"
    created-at: uint,
    completed-at: (optional uint)
  }
)

(define-public (create-escrow (job-id uint) (freelancer principal))
  (let ((job (unwrap! (map-get? jobs { job-id: job-id }) (err u404)))
        (caller tx-sender))
    ;; Verify caller is the client
    (asserts! (is-eq (get client job) caller) (err u403))
    ;; Verify job is open
    (asserts! (is-eq (get status job) "open") (err u400))
    
    ;; Lock payment in escrow
    (try! (stx-transfer? (get budget job) caller (as-contract tx-sender)))
    
    ;; Create escrow record
    (map-insert escrows 
      { job-id: job-id } 
      { 
        client: caller,
        freelancer: freelancer,
        amount: (get budget job),
        status: "locked",
        created-at: block-height,
        completed-at: none
      }
    )
    
    ;; Update job status
    (try! (contract-call? .job-registry update-job-status job-id "assigned" (some freelancer)))
    
    (ok true)
  )
)

(define-public (release-payment (job-id uint))
  (let ((escrow (unwrap! (map-get? escrows { job-id: job-id }) (err u404)))
        (caller tx-sender))
    ;; Verify caller is the client
    (asserts! (is-eq (get client escrow) caller) (err u403))
    ;; Verify escrow is locked
    (asserts! (is-eq (get status escrow) "locked") (err u400))
    
    ;; Release payment to freelancer
    (try! (as-contract (stx-transfer? (get amount escrow) tx-sender (get freelancer escrow))))
    
    ;; Update escrow status
    (map-set escrows 
      { job-id: job-id } 
      (merge escrow { 
        status: "released", 
        completed-at: (some block-height) 
      })
    )
    
    ;; Update job status
    (try! (contract-call? .job-registry update-job-status job-id "completed" none))
    
    (ok true)
  )
)

;; Additional functions for dispute handling, refunds, etc.