<?php
// Simpan hasil quiz user
function lms_submit_quiz(WP_REST_Request $request) {
    $user_id = get_current_user_id();
    $quiz_id = $request->get_param('quiz_id');
    $score   = $request->get_param('score');
    $answers = $request->get_param('answers');

    update_user_meta($user_id, "quiz_result_$quiz_id", [
        'score' => $score,
        'answers' => $answers,
        'date' => current_time('mysql')
    ]);

    return [
        'success' => true,
        'message' => 'Quiz submitted',
        'data' => [
            'quiz_id' => $quiz_id,
            'score'   => $score,
            'user_id' => $user_id
        ]
    ];
}

// Ambil quiz user yang login
function lms_get_user_quizzes(WP_REST_Request $request) {
    $user_id = get_current_user_id();
    return lms_fetch_user_quizzes($user_id);
}

// Ambil semua user untuk admin
function lms_get_users(WP_REST_Request $request) {
    $users = get_users();
    $data = [];

    foreach ($users as $user) {
        $quizzes = lms_fetch_user_quizzes($user->ID);
        $data[] = [
            'id' => $user->ID,
            'username' => $user->user_login,
            'email' => $user->user_email,
            'quiz_count' => count($quizzes),
        ];
    }

    return $data;
}

// Detail user: quiz + soal + jawaban
function lms_get_user_detail(WP_REST_Request $request) {
    $user_id = $request->get_param('id');
    $user = get_user_by('id', $user_id);

    if (!$user) {
        return new WP_Error('not_found', 'User not found', ['status' => 404]);
    }

    $quizzes = lms_fetch_user_quizzes($user_id);

    // Ambil soal dari CPT quiz
    foreach ($quizzes as &$quiz) {
        $quiz_post = get_post($quiz['quiz_id']);
        if ($quiz_post) {
            $quiz['quiz_title'] = $quiz_post->post_title;
            $quiz['quiz_content'] = $quiz_post->post_content;

            // Kalau soal pakai ACF
            if (function_exists('get_fields')) {
                $quiz['questions'] = get_fields($quiz['quiz_id']); 
            }
        }
    }

    return [
        'id' => $user->ID,
        'username' => $user->user_login,
        'email' => $user->user_email,
        'quizzes' => $quizzes
    ];
}

// Helper ambil quiz user
function lms_fetch_user_quizzes($user_id) {
    global $wpdb;
    $results = $wpdb->get_results($wpdb->prepare(
        "SELECT meta_key, meta_value 
         FROM $wpdb->usermeta 
         WHERE user_id = %d 
         AND meta_key LIKE %s",
        $user_id,
        'quiz_result_%'
    ));

    $data = [];
    foreach ($results as $row) {
        $quiz_id = str_replace('quiz_result_', '', $row->meta_key);
        $meta = maybe_unserialize($row->meta_value);

        $data[] = [
            'quiz_id' => (int) $quiz_id,
            'score'   => $meta['score'] ?? null,
            'answers' => $meta['answers'] ?? null,
            'date'    => $meta['date'] ?? null
        ];
    }

    return $data;
}