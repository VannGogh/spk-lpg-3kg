<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DistributionDetail extends Model
{
    protected $fillable = [
        'distribution_id', 'warung_id', 'requested_qty', 
        'recommended_qty', 'final_qty', 'delivery_status'
    ];

    public function distribution()
    {
        return $this->belongsTo(Distribution::class);
    }

    public function warung()
    {
        return $this->belongsTo(Warung::class);
    }
}
