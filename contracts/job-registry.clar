;; Job Registry Contract
;; Manages job listings and their status

(define-data-var job-counter uint u0)

(define-map jobs 
  { job-id: uint } 
  { 
    client: principal,
    title: (string-ascii 100),
    description-url: (string-utf8 256), ;; Gaia URL
    category: (string-ascii 50),
    budget: uint,
    deadline: uint, ;; burn-block-height
    status: (string-ascii 20), ;; "open", "assigned", "completed", "disputed", "cancelled"
    freelancer: (optional principal),
    created-at: uint
  }
)

(define-public (create-job 
    (title (string-ascii 100)) 
    (description-url (string-utf8 256))
    (category (string-ascii 50))
    (budget uint)
    (deadline uint))
  (let ((job-id (var-get job-counter))
        (caller tx-sender))
    ;; Verify caller is registered as client
    (asserts! (is-some (map-get? users {user-id: caller})) (err u404))
    
    (map-insert jobs 
      { job-id: job-id } 
      { 
        client: caller,
        title: title,
        description-url: description-url,
        category: category,
        budget: budget,
        deadline: deadline,
        status: "open",
        freelancer: none,
        created-at: block-height
      }
    )
    (var-set job-counter (+ job-id u1))
    (ok job-id)
  )
)

;; Additional functions for job management