<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $casts = [
        'metadata' => 'array',
        'read_at' => 'datetime'
    ];

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'type',
        'metadata',
        'read_at',
    ];

    public function request()
    {
        return $this->belongsTo(Request::class, 'metadata->request_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function markAsRead()
    {
        $this->update(['read_at' => now()]);
    }
    
    public function scopeUnread($query)
    {
        return $query->whereNull('read_at');
    }

}
