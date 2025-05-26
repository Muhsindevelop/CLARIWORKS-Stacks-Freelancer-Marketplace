;; User Registry Contract
;; Manages user profiles and authentication

(define-data-var user-counter uint u0)

(define-map users 
  { user-id: principal } 
  { 
    username: (string-ascii 50),
    user-type: (string-ascii 10), ;; "client" or "freelancer"
    profile-data-url: (string-utf8 256), ;; Gaia URL
    rating-sum: uint,
    rating-count: uint,
    active: bool
  }
)

(define-public (register-user (username (string-ascii 50)) (user-type (string-ascii 10)) (profile-data-url (string-utf8 256)))
  (let ((caller tx-sender))
    (asserts! (is-none (map-get? users {user-id: caller})) (err u403)) ;; User doesn't exist yet
    (asserts! (or (is-eq user-type "client") (is-eq user-type "freelancer")) (err u400)) ;; Valid user type
    
    (map-set users 
      {user-id: caller} 
      {
        username: username,
        user-type: user-type,
        profile-data-url: profile-data-url,
        rating-sum: u0,
        rating-count: u0,
        active: true
      }
    )
    (ok true)
  )
)

;; Additional functions for profile updates, deactivation, etc.